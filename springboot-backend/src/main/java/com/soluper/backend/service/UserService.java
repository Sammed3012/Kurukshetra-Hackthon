package com.soluper.backend.service;

import com.soluper.backend.dto.AuthRequest;
import com.soluper.backend.dto.AuthResponse;
import com.soluper.backend.dto.RegisterRequest;
import com.soluper.backend.model.User;
import com.soluper.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail().toLowerCase().trim())) {
            throw new IllegalArgumentException("Email is already registered in Soluper Syndicate");
        }

        String role = "user";
        if (req.getRoleCode() != null && req.getRoleCode().equalsIgnoreCase("SOLUPER_CHIEF")) {
            role = "admin";
        } else if (req.getRoleCode() != null && req.getRoleCode().equalsIgnoreCase("SOLUPER_CORE")) {
            role = "soluper";
        }

        User user = new User(
                req.getName(),
                req.getEmail().toLowerCase().trim(),
                req.getPassword(), // In production, hash with BCrypt
                role,
                req.getRoleCode()
        );

        User saved = userRepository.save(user);
        String token = "jwt-soluper-" + UUID.randomUUID();
        return new AuthResponse(token, saved, "Registration successful. Welcome to the Syndicate.");
    }

    public AuthResponse authenticate(AuthRequest req) {
        Optional<User> userOpt = userRepository.findByEmail(req.getEmail().toLowerCase().trim());
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid email or security key");
        }

        User user = userOpt.get();
        if (!user.getPassword().equals(req.getPassword())) {
            throw new IllegalArgumentException("Invalid email or security key");
        }

        String token = "jwt-soluper-" + UUID.randomUUID();
        return new AuthResponse(token, user, "Authentication successful. Access granted.");
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
}
