package com.example.backend.classes;

import com.example.backend.classes.Compte;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

// Client.java
@Entity
@Table(name = "clients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Client {
    @Id
    @GeneratedValue(strategy =
            GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Le nom est obligatoire")
    @Size(min = 2, max = 100, message = "Le nom doit contenir entre 2 et 100 caractères")
    private String nom;
    
    @NotBlank(message = "Le prénom est obligatoire")
    @Size(min = 2, max = 100, message = "Le prénom doit contenir entre 2 et 100 caractères")
    private String prenom;
    
    @Temporal(TemporalType.DATE)
    @NotNull(message = "La date de naissance est obligatoire")
    private Date dateNaissance;
    
    @NotBlank(message = "Le sexe est obligatoire")
    @Pattern(regexp = "[MF]", message = "Le sexe doit être 'M' ou 'F'")
    private String sexe; // "M" ou "F"
    
    @NotBlank(message = "L'adresse est obligatoire")
    @Size(min = 5, max = 255, message = "L'adresse doit contenir entre 5 et 255 caractères")
    private String adresse;
    
    @NotBlank(message = "Le téléphone est obligatoire")
    @Pattern(regexp = "^[+]?[0-9]+$", message = "Le numéro de téléphone doit contenir uniquement des chiffres")
    private String telephone;
    
    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "L'email doit être valide")
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
    private String password;
    
    @NotBlank(message = "La nationalité est obligatoire")
    @Size(min = 2, max = 100, message = "La nationalité doit contenir entre 2 et 100 caractères")
    private String nationalité;
    @OneToMany(mappedBy = "client", cascade =
            CascadeType.ALL)
    private List<Compte> comptes = new ArrayList<>();
}
