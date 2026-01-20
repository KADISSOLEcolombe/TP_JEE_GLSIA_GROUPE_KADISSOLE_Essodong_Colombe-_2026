package com.example.backend.services;

import com.example.backend.classes.Client;
import com.example.backend.repository.ClientsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ClientsService {

    @Autowired
    private ClientsRepository clientsRepository;

    // CREATE - Créer un nouveau client
    public Client createClient(Client client) {
        validateClient(client);
        return clientsRepository.save(client);
    }

    // CREATE - Créer plusieurs clients
    public List<Client> createClients(List<Client> clients) {
        clients.forEach(this::validateClient);
        return clientsRepository.saveAll(clients);
    }

    // READ - Récupérer tous les clients
    public List<Client> getAllClients() {
        return clientsRepository.findAll();
    }

    // READ - Récupérer un client par ID
    public Optional<Client> getClientById(int id) {
        return clientsRepository.findById(id);
    }

    // READ - Vérifier si un client existe par ID
    public boolean clientExists(int id) {
        return clientsRepository.existsById(id);
    }

    // UPDATE - Mettre à jour complètement un client
    public Client updateClient(int id, Client clientDetails) {
        return clientsRepository.findById(id)
                .map(client -> {
                    client.setNom_client(clientDetails.getNom_client());
                    client.setPrenom_client(clientDetails.getPrenom_client());
                    client.setDate_naissance(clientDetails.getDate_naissance());
                    client.setSexe(clientDetails.getSexe());
                    client.setNumero_telephone(clientDetails.getNumero_telephone());
                    client.setCourriel(clientDetails.getCourriel());
                    client.setNationalité(clientDetails.getNationalité());

                    // Validation avant sauvegarde
                    validateClient(client);

                    return clientsRepository.save(client);
                })
                .orElseThrow(() -> new RuntimeException("Client non trouvé avec l'ID: " + id));
    }

    // UPDATE - Mettre à jour partiellement un client
    public Client partialUpdateClient(int id, Client clientDetails) {
        return clientsRepository.findById(id)
                .map(client -> {
                    if (clientDetails.getNom_client() != null && !clientDetails.getNom_client().isEmpty()) {
                        client.setNom_client(clientDetails.getNom_client());
                    }
                    if (clientDetails.getPrenom_client() != null && !clientDetails.getPrenom_client().isEmpty()) {
                        client.setPrenom_client(clientDetails.getPrenom_client());
                    }
                    if (clientDetails.getDate_naissance() != null) {
                        client.setDate_naissance(clientDetails.getDate_naissance());
                    }
                    if (clientDetails.getSexe() != null && !clientDetails.getSexe().isEmpty()) {
                        client.setSexe(clientDetails.getSexe());
                    }
                    if (clientDetails.getNumero_telephone() != 0) {
                        client.setNumero_telephone(clientDetails.getNumero_telephone());
                    }
                    if (clientDetails.getCourriel() != null && !clientDetails.getCourriel().isEmpty()) {
                        client.setCourriel(clientDetails.getCourriel());
                    }
                    if (clientDetails.getNationalité() != null && !clientDetails.getNationalité().isEmpty()) {
                        client.setNationalité(clientDetails.getNationalité());
                    }

                    // Validation avant sauvegarde
                    validateClient(client);

                    return clientsRepository.save(client);
                })
                .orElseThrow(() -> new RuntimeException("Client non trouvé avec l'ID: " + id));
    }

    // DELETE - Supprimer un client par ID
    public boolean deleteClient(int id) {
        if (clientsRepository.existsById(id)) {
            clientsRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // DELETE - Supprimer tous les clients
    public void deleteAllClients() {
        clientsRepository.deleteAll();
    }

    // COUNT - Compter tous les clients
    public long countClients() {
        return clientsRepository.count();
    }

    // Méthodes de recherche personnalisées (implémentation manuelle car non définies dans le repository)

    // Recherche par nom (approximative)
    public List<Client> searchByNom(String nom) {
        return getAllClients().stream()
                .filter(client -> client.getNom_client().toLowerCase().contains(nom.toLowerCase()))
                .toList();
    }

    // Recherche par prénom (approximative)
    public List<Client> searchByPrenom(String prenom) {
        return getAllClients().stream()
                .filter(client -> client.getPrenom_client().toLowerCase().contains(prenom.toLowerCase()))
                .toList();
    }

    // Recherche par email exact
    public Optional<Client> findByEmail(String email) {
        return getAllClients().stream()
                .filter(client -> email.equalsIgnoreCase(client.getCourriel()))
                .findFirst();
    }

    // Recherche par téléphone
    public Optional<Client> findByTelephone(int telephone) {
        return getAllClients().stream()
                .filter(client -> client.getNumero_telephone() == telephone)
                .findFirst();
    }

    // Recherche par nationalité
    public List<Client> searchByNationalite(String nationalite) {
        return getAllClients().stream()
                .filter(client -> client.getNationalité() != null &&
                        client.getNationalité().toLowerCase().contains(nationalite.toLowerCase()))
                .toList();
    }

    // Recherche par sexe
    public List<Client> findBySexe(String sexe) {
        return getAllClients().stream()
                .filter(client -> sexe.equalsIgnoreCase(client.getSexe()))
                .toList();
    }

    // Recherche avancée avec plusieurs critères
    public List<Client> searchClients(String nom, String prenom, String nationalite, String sexe) {
        return getAllClients().stream()
                .filter(client -> {
                    boolean matches = true;

                    if (nom != null && !nom.isEmpty()) {
                        matches = matches && client.getNom_client().toLowerCase().contains(nom.toLowerCase());
                    }
                    if (prenom != null && !prenom.isEmpty()) {
                        matches = matches && client.getPrenom_client().toLowerCase().contains(prenom.toLowerCase());
                    }
                    if (nationalite != null && !nationalite.isEmpty()) {
                        matches = matches && client.getNationalité() != null &&
                                client.getNationalité().toLowerCase().contains(nationalite.toLowerCase());
                    }
                    if (sexe != null && !sexe.isEmpty()) {
                        matches = matches && sexe.equalsIgnoreCase(client.getSexe());
                    }

                    return matches;
                })
                .toList();
    }

    // Vérifier si un email existe
    public boolean emailExists(String email) {
        return getAllClients().stream()
                .anyMatch(client -> email.equalsIgnoreCase(client.getCourriel()));
    }

    // Vérifier si un email existe (en excluant un ID spécifique)
    public boolean emailExists(String email, Integer excludeId) {
        return getAllClients().stream()
                .anyMatch(client ->
                        email.equalsIgnoreCase(client.getCourriel()) &&
                                client.getId_client() != excludeId
                );
    }

    // Vérifier si un téléphone existe
    public boolean telephoneExists(int telephone) {
        return getAllClients().stream()
                .anyMatch(client -> client.getNumero_telephone() == telephone);
    }

    // Vérifier si un téléphone existe (en excluant un ID spécifique)
    public boolean telephoneExists(int telephone, Integer excludeId) {
        return getAllClients().stream()
                .anyMatch(client ->
                        client.getNumero_telephone() == telephone &&
                                client.getId_client() != excludeId
                );
    }

    // Validation du client
    private void validateClient(Client client) {
        if (client.getNom_client() == null || client.getNom_client().trim().isEmpty()) {
            throw new IllegalArgumentException("Le nom du client est obligatoire");
        }
        if (client.getPrenom_client() == null || client.getPrenom_client().trim().isEmpty()) {
            throw new IllegalArgumentException("Le prénom du client est obligatoire");
        }
        if (client.getCourriel() != null && emailExists(client.getCourriel())) {
            throw new IllegalArgumentException("Cet email est déjà utilisé par un autre client");
        }
        if (client.getNumero_telephone() != 0 && telephoneExists(client.getNumero_telephone())) {
            throw new IllegalArgumentException("Ce numéro de téléphone est déjà utilisé par un autre client");
        }
        if (client.getSexe() != null && !client.getSexe().matches("[MFmf]")) {
            throw new IllegalArgumentException("Le sexe doit être 'M' ou 'F'");
        }
    }

    // Méthode utilitaire pour générer un rapport statistique
    public String generateStatsReport() {
        long total = countClients();
        long maleCount = findBySexe("M").size();
        long femaleCount = findBySexe("F").size();

        return String.format(
                "Statistiques des clients:\n" +
                        "Total clients: %d\n" +
                        "Hommes: %d (%.1f%%)\n" +
                        "Femmes: %d (%.1f%%)",
                total,
                maleCount, total > 0 ? (maleCount * 100.0 / total) : 0,
                femaleCount, total > 0 ? (femaleCount * 100.0 / total) : 0
        );
    }
}