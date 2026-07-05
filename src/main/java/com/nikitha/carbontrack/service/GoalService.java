package com.nikitha.carbontrack.service;

import com.nikitha.carbontrack.entity.Goal;
import com.nikitha.carbontrack.repository.GoalRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoalService {

    private final GoalRepository goalRepository;

    public GoalService(GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }

    public Goal saveGoal(Goal goal) {
        return goalRepository.save(goal);
    }

    public List<Goal> getAllGoals() {
        return goalRepository.findAll();
    }
}
