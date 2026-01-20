package com.example.backend.services;

import com.example.backend.classes.Compte;
import com.example.backend.classes.Transaction;
import com.example.backend.dto.ReleveCompteDTO;
import com.example.backend.repositories.CompteRepository;
import com.example.backend.repositories.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReleveService {

    @Autowired
    private CompteRepository compteRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public ReleveCompteDTO genererReleve(String compteNumero) {
        Compte compte = compteRepository.findByNumero(compteNumero)
                .orElseThrow(() -> new RuntimeException("Compte non trouvé"));

        List<Transaction> transactions = transactionRepository.findByCompteNumero(compteNumero);

        // Calcul des totaux
        Double totalDepots = transactions.stream()
                .filter(t -> "DEPOT".equals(t.getType().toString()))
                .mapToDouble(Transaction::getMontant)
                .sum();

        Double totalRetraits = transactions.stream()
                .filter(t -> "RETRAIT".equals(t.getType().toString()))
                .mapToDouble(Transaction::getMontant)
                .sum();

        Double totalVirementsEnvoyes = transactions.stream()
                .filter(t -> "VIREMENT".equals(t.getType().toString()) && 
                           t.getCompteSource() != null && 
                           t.getCompteSource().getNumero().equals(compteNumero))
                .mapToDouble(Transaction::getMontant)
                .sum();

        Double totalVirementsRecus = transactions.stream()
                .filter(t -> "VIREMENT".equals(t.getType().toString()) && 
                           t.getCompteDestination() != null && 
                           t.getCompteDestination().getNumero().equals(compteNumero))
                .mapToDouble(Transaction::getMontant)
                .sum();

        // Conversion des transactions en DTO
        List<ReleveCompteDTO.TransactionDTO> transactionDTOs = transactions.stream()
                .map(t -> ReleveCompteDTO.TransactionDTO.builder()
                        .id(t.getId())
                        .type(t.getType().toString())
                        .montant(t.getMontant())
                        .dateTransaction(convertToLocalDateTime(t.getDateTransaction()))
                        .compteSource(t.getCompteSource() != null ? t.getCompteSource().getNumero() : null)
                        .compteDestination(t.getCompteDestination() != null ? t.getCompteDestination().getNumero() : null)
                        .description(t.getDescription())
                        .build())
                .collect(Collectors.toList());

        return ReleveCompteDTO.builder()
                .numeroCompte(compte.getNumero())
                .typeCompte(compte.getType().toString())
                .clientNom(compte.getClient().getNom())
                .clientPrenom(compte.getClient().getPrenom())
                .dateGeneration(LocalDateTime.now())
                .soldeActuel(compte.getSolde())
                .totalDepots(totalDepots)
                .totalRetraits(totalRetraits)
                .totalVirementsEnvoyes(totalVirementsEnvoyes)
                .totalVirementsRecus(totalVirementsRecus)
                .transactions(transactionDTOs)
                .build();
    }

    public ReleveCompteDTO genererRelevePeriode(String compteNumero, Date debut, Date fin) {
        Compte compte = compteRepository.findByNumero(compteNumero)
                .orElseThrow(() -> new RuntimeException("Compte non trouvé"));

        List<Transaction> transactions = transactionRepository.findByCompteAndPeriode(compteNumero, debut, fin);

        // Calcul des totaux
        Double totalDepots = transactions.stream()
                .filter(t -> "DEPOT".equals(t.getType().toString()))
                .mapToDouble(Transaction::getMontant)
                .sum();

        Double totalRetraits = transactions.stream()
                .filter(t -> "RETRAIT".equals(t.getType().toString()))
                .mapToDouble(Transaction::getMontant)
                .sum();

        Double totalVirementsEnvoyes = transactions.stream()
                .filter(t -> "VIREMENT".equals(t.getType().toString()) && 
                           t.getCompteSource() != null && 
                           t.getCompteSource().getNumero().equals(compteNumero))
                .mapToDouble(Transaction::getMontant)
                .sum();

        Double totalVirementsRecus = transactions.stream()
                .filter(t -> "VIREMENT".equals(t.getType().toString()) && 
                           t.getCompteDestination() != null && 
                           t.getCompteDestination().getNumero().equals(compteNumero))
                .mapToDouble(Transaction::getMontant)
                .sum();

        // Conversion des transactions en DTO
        List<ReleveCompteDTO.TransactionDTO> transactionDTOs = transactions.stream()
                .map(t -> ReleveCompteDTO.TransactionDTO.builder()
                        .id(t.getId())
                        .type(t.getType().toString())
                        .montant(t.getMontant())
                        .dateTransaction(convertToLocalDateTime(t.getDateTransaction()))
                        .compteSource(t.getCompteSource() != null ? t.getCompteSource().getNumero() : null)
                        .compteDestination(t.getCompteDestination() != null ? t.getCompteDestination().getNumero() : null)
                        .description(t.getDescription())
                        .build())
                .collect(Collectors.toList());

        return ReleveCompteDTO.builder()
                .numeroCompte(compte.getNumero())
                .typeCompte(compte.getType().toString())
                .clientNom(compte.getClient().getNom())
                .clientPrenom(compte.getClient().getPrenom())
                .dateGeneration(LocalDateTime.now())
                .soldeActuel(compte.getSolde())
                .totalDepots(totalDepots)
                .totalRetraits(totalRetraits)
                .totalVirementsEnvoyes(totalVirementsEnvoyes)
                .totalVirementsRecus(totalVirementsRecus)
                .transactions(transactionDTOs)
                .build();
    }

    private LocalDateTime convertToLocalDateTime(Date date) {
        return date.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
    }
}
