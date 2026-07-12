package com.carbontracker.CarbonTracker.service;

import com.carbontracker.CarbonTracker.dto.GoalRequest;
import com.carbontracker.CarbonTracker.dto.GoalResponse;
import com.carbontracker.CarbonTracker.entity.Goal;
import com.carbontracker.CarbonTracker.entity.User;
import com.carbontracker.CarbonTracker.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;

    public GoalResponse saveGoal(User user, GoalRequest request) {

        Goal goal = Goal.builder()
                .user(user)
                .targetReduction(request.getTargetReduction())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .achieved(false)
                .build();

        goal = goalRepository.save(goal);

        return GoalResponse.builder()
                .id(goal.getId())
                .targetReduction(goal.getTargetReduction())
                .startDate(goal.getStartDate())
                .endDate(goal.getEndDate())
                .achieved(goal.getAchieved())
                .build();
    }
}