package com.example.backend.exceptions;

// SoldeInsuffisantException.java
public class SoldeInsuffisantException extends
        RuntimeException {
    public SoldeInsuffisantException(String message) {
        super(message);
    }
}