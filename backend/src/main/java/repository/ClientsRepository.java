package com.example.backend.repository;

import com.example.backend.classes.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientsRepository extends JpaRepository<Client, Integer> {
}
