package com.example.backend.services;

import com.example.backend.classes.Compte;
import com.example.backend.classes.Transaction;
import com.example.backend.classes.TypeTransaction;
import com.example.backend.exceptions.SoldeInsuffisantException;
import com.example.backend.repositories.CompteRepository;
import com.example.backend.repositories.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class BankService {

    @Autowired
    private CompteRepository compteRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    // Versement (Deposit)
    public Transaction faireVersement(String compteNumero, Double montant) {
        // Validation montant
        if (montant == null || montant <= 0) {
            throw new IllegalArgumentException("Le montant doit être positif");
        }
        if (montant > 50000) {
            throw new IllegalArgumentException("Le montant ne peut pas dépasser 50000 euros");
        }

        Compte compte = compteRepository.findByNumero(compteNumero)
                .orElseThrow(() -> new RuntimeException("Compte non trouvé"));

        compte.setSolde(compte.getSolde() + montant);
        compteRepository.save(compte);

        Transaction transaction = new Transaction();
        transaction.setType(TypeTransaction.DEPOT);
        transaction.setMontant(montant);
        transaction.setCompteDestination(compte);
        transaction.setCompteSource(null);
        transaction.setDescription("Versement sur compte");

        return transactionRepository.save(transaction);
    }

    // Retrait (Withdrawal)
    public Transaction faireRetrait(String compteNumero, Double montant) {
        // Validation montant
        if (montant == null || montant <= 0) {
            throw new IllegalArgumentException("Le montant doit être positif");
        }
        if (montant > 50000) {
            throw new IllegalArgumentException("Le montant ne peut pas dépasser 50000 euros");
        }

        Compte compte = compteRepository.findByNumero(compteNumero)
                .orElseThrow(() -> new RuntimeException("Compte non trouvé"));

        if (compte.getSolde() < montant) {
            throw new SoldeInsuffisantException("Solde insuffisant pour effectuer le retrait");
        }

        compte.setSolde(compte.getSolde() - montant);
        compteRepository.save(compte);

        Transaction transaction = new Transaction();
        transaction.setType(TypeTransaction.RETRAIT);
        transaction.setMontant(montant);
        transaction.setCompteSource(compte);
        transaction.setCompteDestination(null);
        transaction.setDescription("Retrait du compte");

        return transactionRepository.save(transaction);
    }

    // Virement (Transfer)
    public Transaction faireVirement(String sourceNumero, String destNumero, Double montant) {
        // Validation montant
        if (montant == null || montant <= 0) {
            throw new IllegalArgumentException("Le montant doit être positif");
        }
        if (montant > 50000) {
            throw new IllegalArgumentException("Le montant ne peut pas dépasser 50000 euros");
        }

        Compte source = compteRepository.findByNumero(sourceNumero)
                .orElseThrow(() -> new RuntimeException("Compte source non trouvé"));

        Compte destination = compteRepository.findByNumero(destNumero)
                .orElseThrow(() -> new RuntimeException("Compte destination non trouvé"));

        if (source.getSolde() < montant) {
            throw new SoldeInsuffisantException("Solde insuffisant pour effectuer le virement");
        }

        // Débit source
        source.setSolde(source.getSolde() - montant);
        compteRepository.save(source);

        // Crédit destination
        destination.setSolde(destination.getSolde() + montant);
        compteRepository.save(destination);

        Transaction transaction = new Transaction();
        transaction.setType(TypeTransaction.VIREMENT);
        transaction.setMontant(montant);
        transaction.setCompteSource(source);
        transaction.setCompteDestination(destination);
        transaction.setDescription(String.format("Virement vers compte %s", destNumero));

        return transactionRepository.save(transaction);
    }
}