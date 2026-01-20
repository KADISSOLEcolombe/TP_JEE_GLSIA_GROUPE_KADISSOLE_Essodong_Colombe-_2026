package com.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReleveCompteDTO {
    private String numeroCompte;
    private String typeCompte;
    private String clientNom;
    private String clientPrenom;
    
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime dateGeneration;
    
    private Double soldeActuel;
    private Double totalDepots;
    private Double totalRetraits;
    private Double totalVirementsEnvoyes;
    private Double totalVirementsRecus;
    
    private List<TransactionDTO> transactions;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TransactionDTO {
        private Long id;
        private String type;
        private Double montant;
        
        @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
        private LocalDateTime dateTransaction;
        
        private String compteSource;
        private String compteDestination;
        private String description;
    }
}
