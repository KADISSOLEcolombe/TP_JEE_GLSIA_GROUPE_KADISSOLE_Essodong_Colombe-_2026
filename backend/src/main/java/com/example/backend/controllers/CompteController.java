package com.example.backend.controllers;

import com.example.backend.classes.Client;
import com.example.backend.classes.Compte;
import com.example.backend.classes.TypeCompte;
import com.example.backend.repositories.ClientRepository;
import com.example.backend.repositories.CompteRepository;
import com.example.backend.services.CompteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/comptes")
@CrossOrigin("*")
public class CompteController {
    @Autowired
    private CompteRepository compteRepository;
    @Autowired
    private ClientRepository clientRepository;
    @Autowired
    private CompteService compteService;

    // GET all comptes
    @GetMapping
    public List<Compte> getAllComptes() {
        return compteRepository.findAll();
    }

    // GET compte by numero
    @GetMapping("/{numero}")
    public ResponseEntity<Compte> getCompteByNumero(@PathVariable String numero) {
        return compteRepository.findByNumero(numero)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE compte (pour un client existant)
    @PostMapping("/client/{clientId}")
    public ResponseEntity<Compte> createCompte(
            @PathVariable Long clientId,
            @RequestParam TypeCompte type) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));
        
        String numero = compteService.genererNumeroCompte(type, "FR");
        Compte compte = new Compte();
        compte.setNumero(numero);
        compte.setType(type);
        compte.setDateCreation(new Date());
        compte.setSolde(0.0);
        compte.setClient(client);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(compteRepository.save(compte));
    }

    // UPDATE compte
    @PutMapping("/{numero}")
    public ResponseEntity<Compte> updateCompte(
            @PathVariable String numero,
            @Valid @RequestBody Compte compteDetails) {
        Compte compte = compteRepository.findByNumero(numero)
                .orElseThrow(() -> new RuntimeException("Compte non trouvé"));
        
        // Mise à jour des champs modifiables
        if (compteDetails.getType() != null) {
            compte.setType(compteDetails.getType());
        }
        if (compteDetails.getSolde() != null && compteDetails.getSolde() >= 0) {
            compte.setSolde(compteDetails.getSolde());
        }
        
        return ResponseEntity.ok(compteRepository.save(compte));
    }

    // DELETE compte
    @DeleteMapping("/{numero}")
    public ResponseEntity<Void> deleteCompte(@PathVariable String numero) {
        Compte compte = compteRepository.findByNumero(numero)
                .orElseThrow(() -> new RuntimeException("Compte non trouvé"));
        
        compteRepository.delete(compte);
        return ResponseEntity.noContent().build();
    }
}
