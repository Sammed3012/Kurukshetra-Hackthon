package com.soluper.backend.service;

import com.soluper.backend.model.Achievement;
import com.soluper.backend.repository.AchievementRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AchievementService {

    private final AchievementRepository achievementRepository;

    public AchievementService(AchievementRepository achievementRepository) {
        this.achievementRepository = achievementRepository;
    }

    public List<Achievement> getAll() {
        return achievementRepository.findAll();
    }

    public Achievement create(Achievement achievement) {
        return achievementRepository.save(achievement);
    }
}
