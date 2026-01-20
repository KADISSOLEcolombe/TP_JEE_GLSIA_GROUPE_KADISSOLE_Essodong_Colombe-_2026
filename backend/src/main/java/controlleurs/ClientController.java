package com.example.backend.controlleurs;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.NoArgsConstructor;

@RestController
@RequestMapping("/clients")
@NoArgsConstructor
public class ClientController {

    @GetMapping
    public String testEndpoint() {
        return "test"; // Retourne directement la chaîne "test" comme réponse JSON
    }

}