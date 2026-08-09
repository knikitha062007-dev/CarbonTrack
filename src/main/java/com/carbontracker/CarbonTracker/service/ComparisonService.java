package com.carbontracker.CarbonTracker.service;

import com.carbontracker.CarbonTracker.dto.ComparisonResponse;
import com.carbontracker.CarbonTracker.entity.Activity;
import com.carbontracker.CarbonTracker.entity.User;
import com.carbontracker.CarbonTracker.repository.ActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ComparisonService {

    private final ActivityRepository activityRepository;
public ComparisonResponse getComparison(User user) {


        LocalDateTime now = LocalDateTime.now();

        LocalDateTime todayStart = now.toLocalDate().atStartOfDay();
        LocalDateTime yesterdayStart = todayStart.minusDays(1);

        LocalDateTime thisWeekStart = todayStart.minusDays(todayStart.getDayOfWeek().getValue() - 1);
        LocalDateTime lastWeekStart = thisWeekStart.minusWeeks(1);

        LocalDateTime thisMonthStart = todayStart.withDayOfMonth(1);
        LocalDateTime lastMonthStart = thisMonthStart.minusMonths(1);

        List<Activity> activities = activityRepository.findByUser(user);

        double today = activities.stream()
                .filter(a -> a.getCreatedAt().isAfter(todayStart))
                .mapToDouble(Activity::getEmission)
                .sum();

        double yesterday = activities.stream()
                .filter(a -> a.getCreatedAt().isAfter(yesterdayStart)
                        && a.getCreatedAt().isBefore(todayStart))
                .mapToDouble(Activity::getEmission)
                .sum();

        double thisWeek = activities.stream()
                .filter(a -> a.getCreatedAt().isAfter(thisWeekStart))
                .mapToDouble(Activity::getEmission)
                .sum();

        double lastWeek = activities.stream()
                .filter(a -> a.getCreatedAt().isAfter(lastWeekStart)
                        && a.getCreatedAt().isBefore(thisWeekStart))
                .mapToDouble(Activity::getEmission)
                .sum();

        double thisMonth = activities.stream()
                .filter(a -> a.getCreatedAt().isAfter(thisMonthStart))
                .mapToDouble(Activity::getEmission)
                .sum();

        double lastMonth = activities.stream()
                .filter(a -> a.getCreatedAt().isAfter(lastMonthStart)
                        && a.getCreatedAt().isBefore(thisMonthStart))
                .mapToDouble(Activity::getEmission)
                .sum();

        return ComparisonResponse.builder()
                .today(today)
                .yesterday(yesterday)
                .thisWeek(thisWeek)
                .lastWeek(lastWeek)
                .thisMonth(thisMonth)
                .lastMonth(lastMonth)
                .build();
    }
}