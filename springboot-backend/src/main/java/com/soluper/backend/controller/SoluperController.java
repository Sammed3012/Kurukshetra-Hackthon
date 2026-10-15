package com.soluper.backend.controller;

import com.soluper.backend.dto.ApiResponse;
import com.soluper.backend.model.Soluper;
import com.soluper.backend.service.SoluperService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solupers")
@CrossOrigin(origins = "*")
public class SoluperController {

    private final SoluperService soluperService;

    public SoluperController(SoluperService soluperService) {
        this.soluperService = soluperService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Soluper>>> getAll(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) String search
    ) {
        List<Soluper> solupers = soluperService.getAll(category, status, featured, search);
        return ResponseEntity.ok(ApiResponse.ok("Retrieved solupers list", solupers));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Soluper>> getById(@PathVariable Long id) {
        return soluperService.getById(id)
                .map(s -> ResponseEntity.ok(ApiResponse.ok("Retrieved soluper profile", s)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Soluper>> create(@RequestBody Soluper soluper) {
        Soluper created = soluperService.create(soluper);
        return ResponseEntity.ok(ApiResponse.ok("Soluper profile created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Soluper>> update(@PathVariable Long id, @RequestBody Soluper soluper) {
        try {
            Soluper updated = soluperService.update(id, soluper);
            return ResponseEntity.ok(ApiResponse.ok("Soluper profile updated successfully", updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        soluperService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Soluper removed successfully", null));
    }
}
