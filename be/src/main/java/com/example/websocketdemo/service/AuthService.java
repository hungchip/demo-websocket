package com.example.websocketdemo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final String demoUsername;
    private final String demoPassword;

    public AuthService(
            @Value("${app.auth.username:admin}") String demoUsername,
            @Value("${app.auth.password:123456}") String demoPassword
    ) {
        this.demoUsername = demoUsername;
        this.demoPassword = demoPassword;
    }

    public boolean isValidCredentials(String username, String password) {
        return demoUsername.equals(username) && demoPassword.equals(password);
    }
}
