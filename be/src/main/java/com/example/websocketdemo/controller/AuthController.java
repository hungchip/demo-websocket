package com.example.websocketdemo.controller;

import com.example.websocketdemo.model.LoginRequest;
import com.example.websocketdemo.model.LoginResponse;
import com.example.websocketdemo.security.JwtService;
import com.example.websocketdemo.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        if (!authService.isValidCredentials(request.getUsername(), request.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid username or password"));
        }

        String token = jwtService.generateToken(request.getUsername());
        return ResponseEntity.ok(new LoginResponse(token, request.getUsername()));
    }
}
