package com.nikitha.carbontrack.controller;

import com.nikitha.carbontrack.entity.Goal;
import com.nikitha.carbontrack.service.GoalService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @PostMapping
    public Goal addGoal(@RequestBody Goal goal) {
        return goalService.saveGoal(goal);
    }

    @GetMapping
    public List<Goal> getAllGoals() {
        return goalService.getAllGoals();
    }
}
