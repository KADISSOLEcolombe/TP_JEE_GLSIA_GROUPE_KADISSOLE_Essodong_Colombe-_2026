package com.example.backend.controllers;

import com.example.backend.classes.Client;
import com.example.backend.repositories.ClientRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin("*")
public class ClientController {
    @Autowired
    private ClientRepository clientRepository;

    // GET all clients
    @GetMapping
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    // GET client by id
    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable Long id) {
        return clientRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE client
    @PostMapping
    public ResponseEntity<Client> createClient(@Valid @RequestBody Client client) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(clientRepository.save(client));
    }

    // UPDATE client
    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(
            @PathVariable Long id,
            @Valid @RequestBody Client clientDetails) {
        return clientRepository.findById(id)
                .map(client -> {
                    if (clientDetails.getNom() != null) {
                        client.setNom(clientDetails.getNom());
                    }
                    if (clientDetails.getPrenom() != null) {
                        client.setPrenom(clientDetails.getPrenom());
                    }
                    if (clientDetails.getEmail() != null) {
                        client.setEmail(clientDetails.getEmail());
                    }
                    if (clientDetails.getTelephone() != null) {
                        client.setTelephone(clientDetails.getTelephone());
                    }
                    if (clientDetails.getAdresse() != null) {
                        client.setAdresse(clientDetails.getAdresse());
                    }
                    if (clientDetails.getDateNaissance() != null) {
                        client.setDateNaissance(clientDetails.getDateNaissance());
                    }
                    if (clientDetails.getSexe() != null) {
                        client.setSexe(clientDetails.getSexe());
                    }
                    if (clientDetails.getNationalité() != null) {
                        client.setNationalité(clientDetails.getNationalité());
                    }
                    return ResponseEntity.ok(clientRepository.save(client));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE client
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        return clientRepository.findById(id)
                .map(client -> {
                    clientRepository.delete(client);
                    return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
