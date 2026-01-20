package com.example.backend.controllers;

import com.example.backend.classes.Admin;
import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.exceptions.ErrorResponse;
import com.example.backend.repositories.AdminRepository;
import com.example.backend.security.JwtProvider;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth/admin")
@CrossOrigin("*")
public class AdminAuthController {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Authentification Admin : /api/auth/admin/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Optional<Admin> adminOptional = adminRepository.findByEmail(loginRequest.getEmail());

            if (adminOptional.isEmpty()) {
                ErrorResponse errorResponse = ErrorResponse.builder()
                        .status(HttpStatus.UNAUTHORIZED.value())
                        .message("Email ou mot de passe incorrect")
                        .timestamp(java.time.LocalDateTime.now())
                        .build();
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }

            Admin admin = adminOptional.get();

            // Vérifier le mot de passe
            if (!passwordEncoder.matches(loginRequest.getPassword(), admin.getPassword())) {
                ErrorResponse errorResponse = ErrorResponse.builder()
                        .status(HttpStatus.UNAUTHORIZED.value())
                        .message("Email ou mot de passe incorrect")
                        .timestamp(java.time.LocalDateTime.now())
                        .build();
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }

            // Générer le token JWT
            String token = jwtProvider.generateToken(admin.getEmail());

            AuthResponse authResponse = new AuthResponse(
                    token,
                    "Authentification admin réussie",
                    admin.getEmail()
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
     * Créer un nouvel admin (optionnel, pour faciliter les tests)
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody LoginRequest registerRequest) {
        try {
            // Vérifier si l'email existe déjà
            if (adminRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
                ErrorResponse errorResponse = ErrorResponse.builder()
                        .status(HttpStatus.BAD_REQUEST.value())
                        .message("Un admin avec cet email existe déjà")
                        .timestamp(java.time.LocalDateTime.now())
                        .build();
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }

            // Créer un nouveau admin
            Admin admin = new Admin();
            admin.setEmail(registerRequest.getEmail());
            admin.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

            adminRepository.save(admin);

            AuthResponse authResponse = new AuthResponse(
                    null,
                    "Admin créé avec succès",
                    admin.getEmail()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(authResponse);

        } catch (Exception e) {
            ErrorResponse errorResponse = ErrorResponse.builder()
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .message("Erreur lors de la création de l'admin : " + e.getMessage())
                    .timestamp(java.time.LocalDateTime.now())
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
