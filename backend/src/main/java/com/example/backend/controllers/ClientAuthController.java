package com.example.backend.controllers;

import com.example.backend.classes.Client;
import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.exceptions.ErrorResponse;
import com.example.backend.repositories.ClientRepository;
import com.example.backend.security.JwtProvider;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth/client")
@CrossOrigin("*")
public class ClientAuthController {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Authentification Client : /api/auth/client/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Optional<Client> clientOptional = clientRepository.findByEmail(loginRequest.getEmail());

            if (clientOptional.isEmpty()) {
                ErrorResponse errorResponse = ErrorResponse.builder()
                        .status(HttpStatus.UNAUTHORIZED.value())
                        .message("Email ou mot de passe incorrect")
                        .timestamp(java.time.LocalDateTime.now())
                        .build();
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }

            Client client = clientOptional.get();

            // Vérifier le mot de passe
            if (!passwordEncoder.matches(loginRequest.getPassword(), client.getPassword())) {
                ErrorResponse errorResponse = ErrorResponse.builder()
                        .status(HttpStatus.UNAUTHORIZED.value())
                        .message("Email ou mot de passe incorrect")
                        .timestamp(java.time.LocalDateTime.now())
                        .build();
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }

            // Générer le token JWT
            String token = jwtProvider.generateToken(client.getEmail());

            AuthResponse authResponse = new AuthResponse(
                    token,
                    "Authentification client réussie",
                    client.getEmail()
            );

            return ResponseEntity.ok(authResponse);

        } catch (Exception e) {
            ErrorResponse errorResponse = ErrorResponse.builder()
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .message("Erreur lors de l'authentification : " + e.getMessage())
                    .timestamp(java.time.LocalDateTime.now())
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Inscription Client : /api/auth/client/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody Client client) {
        try {
            // Vérifier si l'email existe déjà
            if (clientRepository.findByEmail(client.getEmail()).isPresent()) {
                ErrorResponse errorResponse = ErrorResponse.builder()
                        .status(HttpStatus.CONFLICT.value())
                        .message("Un compte avec cet email existe déjà")
                        .timestamp(java.time.LocalDateTime.now())
                        .build();
                return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
            }

            // Encoder le mot de passe
            client.setPassword(passwordEncoder.encode(client.getPassword()));

            // Sauvegarder le client
            Client savedClient = clientRepository.save(client);

            // Générer le token JWT
            String token = jwtProvider.generateToken(savedClient.getEmail());

            AuthResponse authResponse = new AuthResponse(
                    token,
                    "Inscription client réussie",
                    savedClient.getEmail()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(authResponse);

        } catch (Exception e) {
            ErrorResponse errorResponse = ErrorResponse.builder()
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .message("Erreur lors de l'inscription : " + e.getMessage())
                    .timestamp(java.time.LocalDateTime.now())
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
