package com.example.backend.repository;

import com.example.backend.classes.Compte;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComptesRepository extends JpaRepository<Compte, Integer> {
}
