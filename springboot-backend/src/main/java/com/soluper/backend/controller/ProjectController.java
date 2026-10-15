package com.soluper.backend.controller;

import com.soluper.backend.dto.ApiResponse;
import com.soluper.backend.model.Project;
import com.soluper.backend.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Project>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok("Retrieved projects", projectService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Project>> getById(@PathVariable Long id) {
        return projectService.getById(id)
                .map(p -> ResponseEntity.ok(ApiResponse.ok("Retrieved project", p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Project>> create(@RequestBody Project project) {
        return ResponseEntity.ok(ApiResponse.ok("Project created", projectService.create(project)));
    }
}
