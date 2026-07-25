package com.carbontracker.CarbonTracker.service;

import com.carbontracker.CarbonTracker.dto.DashboardResponse;
import com.carbontracker.CarbonTracker.dto.MonthlyEmissionResponse;
import com.carbontracker.CarbonTracker.dto.WeeklyEmissionResponse;
import com.carbontracker.CarbonTracker.entity.Activity;
import com.carbontracker.CarbonTracker.entity.User;
import com.carbontracker.CarbonTracker.repository.ActivityRepository;
import com.carbontracker.CarbonTracker.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ActivityRepository activityRepository;
    private final GoalRepository goalRepository;
    //@Cacheable(value = "dashboard", key = "#user.id")
    public DashboardResponse getDashboard(User user) {
        System.out.println("******** FETCHING FROM DATABASE ********");
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
        Double dailyGoal = user.getCo2Goal();
        Double todayEmission = activityRepository.getTodayEmission(user);

        Double remainingToday = Math.max(0, dailyGoal - todayEmission);

        Double dailyProgress =
                dailyGoal == 0 ? 0 : (todayEmission / dailyGoal) * 100;

        String dailyStatus;

        if (todayEmission > dailyGoal) {
            dailyStatus = "Exceeded";
        }
        else if (dailyProgress >= 80) {
            dailyStatus = "Near Limit";
        }
        else {
            dailyStatus = "On Track";
        }
        System.out.println("Daily Goal = " + dailyGoal);
        System.out.println("Today Emission = " + todayEmission);
        System.out.println("Remaining = " + remainingToday);
        System.out.println("Progress = " + dailyProgress);
        System.out.println("Status = " + dailyStatus);
        return DashboardResponse.builder()
                .totalEmission(total)
                .transportEmission(transport)
                .electricityEmission(electricity)
                .foodEmission(food)
                .shoppingEmission(shopping)
                .totalActivities(activities)
                .goal(goal)
                .goalPercentage(percentage)

                .dailyGoal(dailyGoal)
                .todayEmission(todayEmission)
                .remainingToday(remainingToday)
                .dailyProgress(dailyProgress)
                .dailyStatus(dailyStatus)
                .build();
    }
    public List<WeeklyEmissionResponse> getWeeklyEmission(User user) {

        List<Activity> activities = activityRepository.findByUserAndCreatedAtAfter(
                user,
                LocalDateTime.now().minusDays(6)
        );

        Map<String, Double> weekly = new LinkedHashMap<>();

        for (Activity a : activities) {
            String day = a.getCreatedAt()
                    .getDayOfWeek()
                    .name()
                    .substring(0, 3);

            weekly.put(day,
                    weekly.getOrDefault(day, 0.0) + a.getEmission());
        }

        return weekly.entrySet()
                .stream()
                .map(e -> new WeeklyEmissionResponse(e.getKey(), e.getValue()))
                .toList();
    }

    public List<MonthlyEmissionResponse> getMonthlyEmission(User user) {
        return activityRepository.getMonthlyEmission(user);
    }
}