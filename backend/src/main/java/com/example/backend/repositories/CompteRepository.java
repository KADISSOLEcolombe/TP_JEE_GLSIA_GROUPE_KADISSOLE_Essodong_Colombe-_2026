package com.example.backend.repositories;

import com.example.backend.classes.Compte;
import com.example.backend.classes.TypeCompte;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

// CompteRepository.java
public interface CompteRepository extends JpaRepository<Compte, String> {
    List<Compte> findByClientId(Long clientId);
    List<Compte> findByType(TypeCompte type);
    Optional<Compte> findByNumero(String numero);
}

