package com.soluper.backend.service;

import com.soluper.backend.model.Soluper;
import com.soluper.backend.repository.SoluperRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SoluperService {

    private final SoluperRepository soluperRepository;

    public SoluperService(SoluperRepository soluperRepository) {
        this.soluperRepository = soluperRepository;
    }

    public List<Soluper> getAll(String category, String status, Boolean featured, String search) {
        if (search != null && !search.trim().isEmpty()) {
            return soluperRepository.findByNameContainingIgnoreCase(search.trim());
        }
        if (category != null && !category.equalsIgnoreCase("All")) {
            return soluperRepository.findByCategoryIgnoreCase(category);
        }
        if (status != null && !status.trim().isEmpty()) {
            return soluperRepository.findByStatusIgnoreCase(status);
        }
        if (Boolean.TRUE.equals(featured)) {
            return soluperRepository.findByFeaturedTrue();
        }
        return soluperRepository.findAll();
    }

    public Optional<Soluper> getById(Long id) {
        return soluperRepository.findById(id);
    }

    public Soluper create(Soluper soluper) {
        return soluperRepository.save(soluper);
    }

    public Soluper update(Long id, Soluper updated) {
        return soluperRepository.findById(id).map(existing -> {
            if (updated.getName() != null) existing.setName(updated.getName());
            if (updated.getRole() != null) existing.setRole(updated.getRole());
            if (updated.getCategory() != null) existing.setCategory(updated.getCategory());
            if (updated.getStatus() != null) existing.setStatus(updated.getStatus());
            if (updated.getRoleGroup() != null) existing.setRoleGroup(updated.getRoleGroup());
            if (updated.getImage() != null) existing.setImage(updated.getImage());
            if (updated.getBio() != null) existing.setBio(updated.getBio());
            if (updated.getLocation() != null) existing.setLocation(updated.getLocation());
            if (updated.getJoined() != null) existing.setJoined(updated.getJoined());
            if (updated.getCommits() != null) existing.setCommits(updated.getCommits());
            if (updated.getProjects() != null) existing.setProjects(updated.getProjects());
            if (updated.getGithubUrl() != null) existing.setGithubUrl(updated.getGithubUrl());
            if (updated.getLinkedinUrl() != null) existing.setLinkedinUrl(updated.getLinkedinUrl());
            if (updated.getTwitterUrl() != null) existing.setTwitterUrl(updated.getTwitterUrl());
            if (updated.getGradient() != null) existing.setGradient(updated.getGradient());
            if (updated.getFeatured() != null) existing.setFeatured(updated.getFeatured());
            if (updated.getSkillsJson() != null) existing.setSkillsJson(updated.getSkillsJson());
            if (updated.getPersonalAchievementsJson() != null) existing.setPersonalAchievementsJson(updated.getPersonalAchievementsJson());
            return soluperRepository.save(existing);
        }).orElseThrow(() -> new IllegalArgumentException("Soluper not found with id: " + id));
    }

    public void delete(Long id) {
        soluperRepository.deleteById(id);
    }
}
