package com.example.backend.exceptions;

public class GlobalExceptionHandler extends RuntimeException {
  public GlobalExceptionHandler(String message) {
    super(message);
  }
}
