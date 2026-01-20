package com.example.backend.controllers;

import com.example.backend.classes.Transaction;
import com.example.backend.dto.ReleveCompteDTO;
import com.example.backend.repositories.TransactionRepository;
import com.example.backend.services.BankService;
import com.example.backend.services.ReleveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/bank")
@CrossOrigin("*")
public class BankController {
    @Autowired
    private BankService bankService;
    
    @Autowired
    private ReleveService releveService;
    
    @Autowired
    private TransactionRepository transactionRepository;

    // Versement
    @PostMapping("/versement")
    public Transaction faireVersement(
            @RequestParam String compteNumero,
            @RequestParam Double montant) {
        return bankService.faireVersement(compteNumero, montant);
    }

    // Retrait
    @PostMapping("/retrait")
    public Transaction faireRetrait(
            @RequestParam String compteNumero,
            @RequestParam Double montant) {
        return bankService.faireRetrait(compteNumero, montant);
    }

    // Virement
    @PostMapping("/virement")
    public Transaction faireVirement(
            @RequestParam String sourceNumero,
            @RequestParam String destNumero,
            @RequestParam Double montant) {
        return bankService.faireVirement(sourceNumero, destNumero, montant);
    }

    // Historique des transactions d'un compte
    @GetMapping("/transactions/{compteNumero}")
    public List<Transaction> getTransactions(@PathVariable String compteNumero) {
        return transactionRepository.findByCompteNumero(compteNumero);
    }

    // Historique avec période
    @GetMapping("/transactions/{compteNumero}/periode")
    public List<Transaction> getTransactionsPeriode(
            @PathVariable String compteNumero,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date debut,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date fin) {
        return transactionRepository.findByCompteAndPeriode(compteNumero, debut, fin);
    }

    // Imprimer le relevé (complet)
    @GetMapping("/releve/{compteNumero}")
    public ResponseEntity<ReleveCompteDTO> imprimerReleve(@PathVariable String compteNumero) {
        ReleveCompteDTO releve = releveService.genererReleve(compteNumero);
        return ResponseEntity.ok(releve);
    }

    // Imprimer le relevé pour une période donnée
    @GetMapping("/releve/{compteNumero}/periode")
    public ResponseEntity<ReleveCompteDTO> imprimerRelevePeriode(
            @PathVariable String compteNumero,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date debut,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date fin) {
        ReleveCompteDTO releve = releveService.genererRelevePeriode(compteNumero, debut, fin);
        return ResponseEntity.ok(releve);
    }
}