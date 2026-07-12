package com.carbontracker.CarbonTracker.controller;

import com.carbontracker.CarbonTracker.dto.GoalRequest;
import com.carbontracker.CarbonTracker.dto.GoalResponse;
import com.carbontracker.CarbonTracker.entity.User;
import com.carbontracker.CarbonTracker.service.GoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    @PostMapping
    public GoalResponse createGoal(
            @Valid @RequestBody GoalRequest request,
            @AuthenticationPrincipal User user
    ) {
        System.out.println("GOAL API HIT");
        return goalService.saveGoal(user, request);
    }
}