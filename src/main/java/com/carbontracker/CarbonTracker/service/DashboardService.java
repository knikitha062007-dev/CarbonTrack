package com.carbontracker.CarbonTracker.service;

import com.carbontracker.CarbonTracker.dto.DashboardResponse;
import com.carbontracker.CarbonTracker.entity.User;
import com.carbontracker.CarbonTracker.repository.ActivityRepository;
import com.carbontracker.CarbonTracker.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ActivityRepository activityRepository;
    private final GoalRepository goalRepository;
    public DashboardResponse getDashboard(User user) {

        double total = activityRepository.getTotalEmissionByUser(user);

        double transport = activityRepository.getTransportEmission(user);

        double electricity = activityRepository.getElectricityEmission(user);

        double food = activityRepository.getFoodEmission(user);

        double shopping = activityRepository.getShoppingEmission(user);

        long activities = activityRepository.countByUser(user);

        double goal = goalRepository.findByUser(user)
                .map(g -> g.getTargetReduction())
                .orElse(500.0);

        double percentage = goal == 0 ? 0 : (total / goal) * 100;

        return DashboardResponse.builder()
                .totalEmission(total)
                .transportEmission(transport)
                .electricityEmission(electricity)
                .foodEmission(food)
                .shoppingEmission(shopping)
                .totalActivities(activities)
                .goal(goal)
                .goalPercentage(percentage)
                .build();
    }
}