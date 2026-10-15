package com.soluper.backend.controller;

import com.soluper.backend.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = "*")
public class HealthController {

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> healthCheck() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("system", "House of Soluper - Spring Boot Core Engine");
        status.put("timestamp", System.currentTimeMillis());
        status.put("database", "H2 Embedded (In-Memory)");
        status.put("h2Console", "/h2-console");
        return ResponseEntity.ok(ApiResponse.ok("System Operational", status));
    }
}
