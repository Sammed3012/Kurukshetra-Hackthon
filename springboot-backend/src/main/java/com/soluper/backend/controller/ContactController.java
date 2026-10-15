package com.soluper.backend.controller;

import com.soluper.backend.dto.ApiResponse;
import com.soluper.backend.model.ContactMessage;
import com.soluper.backend.service.ContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ContactMessage>> sendMessage(@RequestBody ContactMessage message) {
        ContactMessage saved = contactService.saveMessage(message);
        return ResponseEntity.ok(ApiResponse.ok("Transmission packet received. Core syndicate notified.", saved));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ContactMessage>>> getAllMessages() {
        return ResponseEntity.ok(ApiResponse.ok("Retrieved transmission log", contactService.getAllMessages()));
    }
}
