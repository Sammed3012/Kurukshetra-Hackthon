package com.soluper.backend.controller;

import com.soluper.backend.dto.ApiResponse;
import com.soluper.backend.model.Achievement;
import com.soluper.backend.service.AchievementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/achievements")
@CrossOrigin(origins = "*")
public class AchievementController {

    private final AchievementService achievementService;

    public AchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Achievement>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok("Retrieved achievements", achievementService.getAll()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Achievement>> create(@RequestBody Achievement achievement) {
        return ResponseEntity.ok(ApiResponse.ok("Achievement recorded", achievementService.create(achievement)));
    }
}
