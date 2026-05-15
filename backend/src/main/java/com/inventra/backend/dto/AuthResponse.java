package com.inventra.backend.dto;

import com.inventra.backend.entity.Role;

public class AuthResponse {

    private String token;
    private String role;
    private String username;

    public AuthResponse() {
    }

    public AuthResponse(
            String token,
            Role role,
            String username) {
        this.token = token;
        this.role = role.name();
        this.username = username;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}