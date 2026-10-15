package com.soluper.backend.dto;

import com.soluper.backend.model.User;

public class AuthResponse {
    private String token;
    private Long id;
    private String name;
    private String email;
    private String role;
    private String message;

    public AuthResponse() {}

    public AuthResponse(String token, User user, String message) {
        this.token = token;
        if (user != null) {
            this.id = user.getId();
            this.name = user.getName();
            this.email = user.getEmail();
            this.role = user.getRole();
        }
        this.message = message;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
