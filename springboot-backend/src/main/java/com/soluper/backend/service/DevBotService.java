package com.soluper.backend.service;

import org.springframework.stereotype.Service;

@Service
public class DevBotService {

    public String generateBotResponse(String message, String theme) {
        if (message == null || message.trim().isEmpty()) {
            return "How can I assist you with Solution Developers or the Solupers Syndicate?";
        }

        String lower = message.toLowerCase().trim();

        if (lower.contains("hire") || lower.contains("recruit") || lower.contains("job") || lower.contains("career")) {
            return "Looking to hire top-tier engineering talent? Explore our Team page or submit a transmission via our Contact form at hello@solutiondevelopers.com.";
        } else if (lower.contains("contact") || lower.contains("reach") || lower.contains("email")) {
            return "You can reach us directly via the Contact section below or email hello@solutiondevelopers.com.";
        } else if (lower.contains("tech") || lower.contains("stack") || lower.contains("framework")) {
            return "Our syndicate specializes in modern full-stack engineering: React, Vite, Spring Boot, Java, Node.js, Python, Flutter, Cloud Native architectures, and LLM agentic workflows.";
        } else if (lower.contains("event") || lower.contains("hackathon") || lower.contains("summit")) {
            return "We regularly host events like the AI Innovation Summit and Vanguard Hackathon! Check the Events page to register.";
        } else if (lower.contains("soluper") || lower.contains("syndicate") || lower.contains("founder")) {
            return "House of Soluper is an elite collective of builders, engineers, and architects founded by Hariom Sandve and led by innovative presidents and chief architects.";
        } else if (lower.contains("project") || lower.contains("repo")) {
            return "Check out our Projects page showcasing Edu-Advisory, Digi-Traffic, and DevForge CLI!";
        } else if (lower.contains("hello") || lower.contains("hi") || lower.contains("hey")) {
            return "Greetings! I am DevBot AI, the interactive core intelligence of House of Soluper. How may I serve your inquiry?";
        }

        return "I am connected to the Soluper Core. Feel free to explore our Solupers directory, register for upcoming events, or transmit a message through the contact portal!";
    }
}
