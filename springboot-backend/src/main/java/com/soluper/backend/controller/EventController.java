package com.soluper.backend.controller;

import com.soluper.backend.dto.ApiResponse;
import com.soluper.backend.dto.EventRegistrationRequest;
import com.soluper.backend.model.Event;
import com.soluper.backend.model.EventRegistration;
import com.soluper.backend.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Event>>> getAll(
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String status
    ) {
        List<Event> events = eventService.getAll(tag, status);
        return ResponseEntity.ok(ApiResponse.ok("Retrieved events list", events));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Event>> getById(@PathVariable Long id) {
        return eventService.getById(id)
                .map(e -> ResponseEntity.ok(ApiResponse.ok("Retrieved event details", e)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Event>> create(@RequestBody Event event) {
        Event created = eventService.create(event);
        return ResponseEntity.ok(ApiResponse.ok("Event created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Event>> update(@PathVariable Long id, @RequestBody Event event) {
        try {
            Event updated = eventService.update(id, event);
            return ResponseEntity.ok(ApiResponse.ok("Event updated successfully", updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        eventService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Event removed successfully", null));
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<ApiResponse<EventRegistration>> register(
            @PathVariable Long id,
            @Valid @RequestBody EventRegistrationRequest request
    ) {
        try {
            EventRegistration reg = eventService.registerParticipant(id, request);
            return ResponseEntity.ok(ApiResponse.ok("Successfully registered for event!", reg));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}/registrations")
    public ResponseEntity<ApiResponse<List<EventRegistration>>> getRegistrations(@PathVariable Long id) {
        List<EventRegistration> registrations = eventService.getRegistrations(id);
        return ResponseEntity.ok(ApiResponse.ok("Retrieved event registrations", registrations));
    }
}
