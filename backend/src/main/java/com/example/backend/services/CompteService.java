package com.example.backend.services;

import com.example.backend.classes.TypeCompte;
import org.iban4j.CountryCode;
import org.iban4j.Iban;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class CompteService {
    private static final String BANK_CODE = "30006"; // Code banque fictif
    private static final String BRANCH_CODE = "00011"; // Code agence
    private static final int ACCOUNT_NUMBER_LENGTH = 11;

    public String genererNumeroCompte(TypeCompte type, String paysCode) {
        // IBAN format: FR76 3000 6000 0112 3456 7890 189

        // Générer un numéro de compte aléatoire avec le bon format (11 chiffres)
        Random random = new Random();
        long accountNumber = 100_000_000_000L + (random.nextLong() % 900_000_000_000L);
        String formattedAccountNumber = String.format("%011d", Math.abs(accountNumber));

        // Convertir le code pays en CountryCode (ex: "FR" -> CountryCode.FR)
        CountryCode countryCode;
        try {
            countryCode = CountryCode.valueOf(paysCode.toUpperCase());
        } catch (IllegalArgumentException e) {
            // Valeur par défaut si le code pays n'est pas valide
            countryCode = CountryCode.FR;
        }

        // Générer l'IBAN
        Iban iban = new Iban.Builder()
                .countryCode(countryCode)
                .bankCode(BANK_CODE)
                .branchCode(BRANCH_CODE)
                .accountNumber(formattedAccountNumber)
                .build();

        return iban.toString();
    }
}