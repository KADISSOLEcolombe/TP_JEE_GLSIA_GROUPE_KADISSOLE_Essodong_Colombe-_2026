package com.example.backend.repositories;

import com.example.backend.classes.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

// ClientRepository.java
public interface ClientRepository extends
        JpaRepository<Client, Long> {
    Optional<Client> findByEmail(String email);
    List<Client> findByNomContainingIgnoreCase(String
                                                       nom);
}


