package com.example.backend.services;

import com.example.backend.classes.Compte;
import com.example.backend.repository.ComptesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CompteService {

    @Autowired
    private ComptesRepository comptesRepository;

    // CREATE - Créer un nouveau compte
    public Compte createCompte(Compte compte) {
        validateCompte(compte);

        // Définir la date de création si elle n'est pas fournie
        if (compte.getDate_creation() == null) {
            compte.setDate_creation(LocalDateTime.now());
        }

        return comptesRepository.save(compte);
    }

    // CREATE - Créer plusieurs comptes
    public List<Compte> createComptes(List<Compte> comptes) {
        comptes.forEach(this::validateCompte);
        return comptesRepository.saveAll(comptes);
    }

    // READ - Récupérer tous les comptes
    public List<Compte> getAllComptes() {
        return comptesRepository.findAll();
    }

    // READ - Récupérer tous les comptes triés par solde (décroissant)
    public List<Compte> getAllComptesOrderBySoldeDesc() {
        return getAllComptes().stream()
                .sorted((c1, c2) -> Double.compare(c2.getSolde_compte(), c1.getSolde_compte()))
                .toList();
    }

    // READ - Récupérer un compte par ID
    public Optional<Compte> getCompteById(int id) {
        return comptesRepository.findById(id);
    }

    // READ - Récupérer un compte par numéro de compte
    public Optional<Compte> getCompteByNumero(String numeroCompte) {
        return getAllComptes().stream()
                .filter(compte -> numeroCompte.equals(compte.getNumero_compte()))
                .findFirst();
    }

    // READ - Vérifier si un compte existe par ID
    public boolean compteExists(int id) {
        return comptesRepository.existsById(id);
    }

    // READ - Vérifier si un numéro de compte existe
    public boolean numeroCompteExists(String numeroCompte) {
        return getCompteByNumero(numeroCompte).isPresent();
    }

    // UPDATE - Mettre à jour complètement un compte
    public Compte updateCompte(int id, Compte compteDetails) {
        return comptesRepository.findById(id)
                .map(compte -> {
                    compte.setNumero_compte(compteDetails.getNumero_compte());
                    compte.setType_compte(compteDetails.getType_compte());
                    compte.setDate_creation(compteDetails.getDate_creation());
                    compte.setSolde_compte(compteDetails.getSolde_compte());
                    compte.setNom_proprietaire(compteDetails.getNom_proprietaire());

                    validateCompte(compte);
                    return comptesRepository.save(compte);
                })
                .orElseThrow(() -> new RuntimeException("Compte non trouvé avec l'ID: " + id));
    }

    // UPDATE - Mettre à jour partiellement un compte
    public Compte partialUpdateCompte(int id, Compte compteDetails) {
        return comptesRepository.findById(id)
                .map(compte -> {
                    if (compteDetails.getNumero_compte() != null && !compteDetails.getNumero_compte().isEmpty()) {
                        compte.setNumero_compte(compteDetails.getNumero_compte());
                    }
                    if (compteDetails.getType_compte() != null && !compteDetails.getType_compte().isEmpty()) {
                        compte.setType_compte(compteDetails.getType_compte());
                    }
                    if (compteDetails.getDate_creation() != null) {
                        compte.setDate_creation(compteDetails.getDate_creation());
                    }
                    if (compteDetails.getSolde_compte() != 0) {
                        compte.setSolde_compte(compteDetails.getSolde_compte());
                    }
                    if (compteDetails.getNom_proprietaire() != null && !compteDetails.getNom_proprietaire().isEmpty()) {
                        compte.setNom_proprietaire(compteDetails.getNom_proprietaire());
                    }

                    validateCompte(compte);
                    return comptesRepository.save(compte);
                })
                .orElseThrow(() -> new RuntimeException("Compte non trouvé avec l'ID: " + id));
    }

    // UPDATE - Mettre à jour le solde d'un compte (opérations bancaires)
    public Compte updateSolde(int id, double nouveauSolde) {
        return comptesRepository.findById(id)
                .map(compte -> {
                    compte.setSolde_compte(nouveauSolde);
                    return comptesRepository.save(compte);
                })
                .orElseThrow(() -> new RuntimeException("Compte non trouvé avec l'ID: " + id));
    }

    // UPDATE - Créditer un compte
    public Compte crediterCompte(int id, double montant) {
        if (montant <= 0) {
            throw new IllegalArgumentException("Le montant à créditer doit être positif");
        }

        return comptesRepository.findById(id)
                .map(compte -> {
                    double nouveauSolde = compte.getSolde_compte() + montant;
                    compte.setSolde_compte(nouveauSolde);
                    return comptesRepository.save(compte);
                })
                .orElseThrow(() -> new RuntimeException("Compte non trouvé avec l'ID: " + id));
    }

    // UPDATE - Débiter un compte
    public Compte debiterCompte(int id, double montant) {
        if (montant <= 0) {
            throw new IllegalArgumentException("Le montant à débiter doit être positif");
        }

        return comptesRepository.findById(id)
                .map(compte -> {
                    if (compte.getSolde_compte() < montant) {
                        throw new IllegalArgumentException("Solde insuffisant");
                    }

                    double nouveauSolde = compte.getSolde_compte() - montant;
                    compte.setSolde_compte(nouveauSolde);
                    return comptesRepository.save(compte);
                })
                .orElseThrow(() -> new RuntimeException("Compte non trouvé avec l'ID: " + id));
    }

    // DELETE - Supprimer un compte par ID
    public boolean deleteCompte(int id) {
        if (comptesRepository.existsById(id)) {
            comptesRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // DELETE - Supprimer tous les comptes
    public void deleteAllComptes() {
        comptesRepository.deleteAll();
    }

    // COUNT - Compter tous les comptes
    public long countComptes() {
        return comptesRepository.count();
    }

    // MÉTHODES DE RECHERCHE ET FILTRAGE

    // Recherche par type de compte
    public List<Compte> searchByTypeCompte(String typeCompte) {
        return getAllComptes().stream()
                .filter(compte -> compte.getType_compte().equalsIgnoreCase(typeCompte))
                .toList();
    }

    // Recherche par nom du propriétaire
    public List<Compte> searchByProprietaire(String nomProprietaire) {
        return getAllComptes().stream()
                .filter(compte -> compte.getNom_proprietaire().toLowerCase().contains(nomProprietaire.toLowerCase()))
                .toList();
    }

    // Recherche par solde minimum
    public List<Compte> searchBySoldeMin(double soldeMin) {
        return getAllComptes().stream()
                .filter(compte -> compte.getSolde_compte() >= soldeMin)
                .toList();
    }

    // Recherche par solde maximum
    public List<Compte> searchBySoldeMax(double soldeMax) {
        return getAllComptes().stream()
                .filter(compte -> compte.getSolde_compte() <= soldeMax)
                .toList();
    }

    // Recherche par plage de solde
    public List<Compte> searchBySoldeRange(double soldeMin, double soldeMax) {
        return getAllComptes().stream()
                .filter(compte -> compte.getSolde_compte() >= soldeMin && compte.getSolde_compte() <= soldeMax)
                .toList();
    }

    // Recherche par date de création après une certaine date
    public List<Compte> searchByDateCreationAfter(LocalDateTime date) {
        return getAllComptes().stream()
                .filter(compte -> compte.getDate_creation() != null && compte.getDate_creation().isAfter(date))
                .toList();
    }

    // Recherche par date de création avant une certaine date
    public List<Compte> searchByDateCreationBefore(LocalDateTime date) {
        return getAllComptes().stream()
                .filter(compte -> compte.getDate_creation() != null && compte.getDate_creation().isBefore(date))
                .toList();
    }

    // Recherche avancée multi-critères
    public List<Compte> searchComptes(String typeCompte, String nomProprietaire, Double soldeMin, Double soldeMax) {
        return getAllComptes().stream()
                .filter(compte -> {
                    boolean matches = true;

                    if (typeCompte != null && !typeCompte.isEmpty()) {
                        matches = matches && compte.getType_compte().equalsIgnoreCase(typeCompte);
                    }
                    if (nomProprietaire != null && !nomProprietaire.isEmpty()) {
                        matches = matches && compte.getNom_proprietaire().toLowerCase().contains(nomProprietaire.toLowerCase());
                    }
                    if (soldeMin != null) {
                        matches = matches && compte.getSolde_compte() >= soldeMin;
                    }
                    if (soldeMax != null) {
                        matches = matches && compte.getSolde_compte() <= soldeMax;
                    }

                    return matches;
                })
                .toList();
    }

    // STATISTIQUES ET ANALYSES

    // Calculer le solde total de tous les comptes
    public double getTotalSolde() {
        return getAllComptes().stream()
                .mapToDouble(Compte::getSolde_compte)
                .sum();
    }

    // Calculer le solde moyen
    public double getSoldeMoyen() {
        long count = countComptes();
        if (count == 0) return 0;
        return getTotalSolde() / count;
    }

    // Trouver le compte avec le solde maximum
    public Optional<Compte> getCompteWithMaxSolde() {
        return getAllComptes().stream()
                .max((c1, c2) -> Double.compare(c1.getSolde_compte(), c2.getSolde_compte()));
    }

    // Trouver le compte avec le solde minimum
    public Optional<Compte> getCompteWithMinSolde() {
        return getAllComptes().stream()
                .min((c1, c2) -> Double.compare(c1.getSolde_compte(), c2.getSolde_compte()));
    }

    // Compter les comptes par type
    public long countByType(String typeCompte) {
        return searchByTypeCompte(typeCompte).size();
    }

    // Générer un rapport statistique
    public String generateStatsReport() {
        long total = countComptes();
        double totalSolde = getTotalSolde();
        double soldeMoyen = getSoldeMoyen();

        Optional<Compte> maxCompte = getCompteWithMaxSolde();
        Optional<Compte> minCompte = getCompteWithMinSolde();

        StringBuilder report = new StringBuilder();
        report.append("=== RAPPORT STATISTIQUE DES COMPTES ===\n");
        report.append(String.format("Nombre total de comptes: %d\n", total));
        report.append(String.format("Solde total: %.2f\n", totalSolde));
        report.append(String.format("Solde moyen: %.2f\n", soldeMoyen));

        if (maxCompte.isPresent()) {
            report.append(String.format("Compte avec solde max: %s (%.2f)\n",
                    maxCompte.get().getNumero_compte(), maxCompte.get().getSolde_compte()));
        }

        if (minCompte.isPresent()) {
            report.append(String.format("Compte avec solde min: %s (%.2f)\n",
                    minCompte.get().getNumero_compte(), minCompte.get().getSolde_compte()));
        }

        // Statistiques par type de compte
        List<String> types = getAllComptes().stream()
                .map(Compte::getType_compte)
                .distinct()
                .toList();

        report.append("\n=== DISTRIBUTION PAR TYPE ===\n");
        for (String type : types) {
            long countType = countByType(type);
            double pourcentage = total > 0 ? (countType * 100.0 / total) : 0;
            report.append(String.format("%s: %d (%.1f%%)\n", type, countType, pourcentage));
        }

        return report.toString();
    }

    // VALIDATION
    private void validateCompte(Compte compte) {
        if (compte.getNumero_compte() == null || compte.getNumero_compte().trim().isEmpty()) {
            throw new IllegalArgumentException("Le numéro de compte est obligatoire");
        }
        if (compte.getNumero_compte().length() > 20) {
            throw new IllegalArgumentException("Le numéro de compte ne doit pas dépasser 20 caractères");
        }
        if (compte.getType_compte() == null || compte.getType_compte().trim().isEmpty()) {
            throw new IllegalArgumentException("Le type de compte est obligatoire");
        }
        if (compte.getSolde_compte() < 0) {
            throw new IllegalArgumentException("Le solde ne peut pas être négatif");
        }
        if (compte.getNom_proprietaire() == null || compte.getNom_proprietaire().trim().isEmpty()) {
            throw new IllegalArgumentException("Le nom du propriétaire est obligatoire");
        }
        if (compte.getNom_proprietaire().length() > 200) {
            throw new IllegalArgumentException("Le nom du propriétaire ne doit pas dépasser 200 caractères");
        }
        if (numeroCompteExists(compte.getNumero_compte())) {
            throw new IllegalArgumentException("Ce numéro de compte existe déjà");
        }
    }
}