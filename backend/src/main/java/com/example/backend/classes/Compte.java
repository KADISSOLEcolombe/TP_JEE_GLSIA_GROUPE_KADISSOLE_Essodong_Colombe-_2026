package com.example.backend.classes;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "comptes")
@Data
@NoArgsConstructor
public class Compte {
    @Id
    @NotBlank(message = "Le numéro de compte (IBAN) est obligatoire")
    private String numero; // IBAN généré
    
    @NotNull(message = "Le type de compte est obligatoire")
    @Enumerated(EnumType.STRING)
    private TypeCompte type;
    
    @Temporal(TemporalType.DATE)
    @NotNull(message = "La date de création est obligatoire")
    private Date dateCreation;
    
    @NotNull(message = "Le solde est obligatoire")
    @DecimalMin(value = "0.0", message = "Le solde ne peut pas être négatif")
    private Double solde = 0.0;
    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;
    @OneToMany(mappedBy = "compteSource")
    private List<Transaction> transactionsEnvoyees;
    @OneToMany(mappedBy = "compteDestination")
    private List<Transaction> transactionsRecues;
}