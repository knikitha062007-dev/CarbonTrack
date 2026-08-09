package com.carbontracker.CarbonTracker.service;

import com.carbontracker.CarbonTracker.dto.CertificateResponse;
import com.carbontracker.CarbonTracker.dto.LeaderboardResponse;
import com.carbontracker.CarbonTracker.entity.Activity;
import com.carbontracker.CarbonTracker.entity.User;
import com.carbontracker.CarbonTracker.repository.ActivityRepository;
import com.carbontracker.CarbonTracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Set;
import java.util.HashSet;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final LeaderboardService leaderboardService;

    public CertificateResponse getCertificate(User user) {

        Long totalActivities = activityRepository.countByUser(user);

        Double totalEmission = activityRepository.getTotalEmissionByUser(user);

        if (totalEmission == null) {
            totalEmission = 0.0;
        }

        List<Activity> activities = activityRepository.findByUser(user);

        Set<LocalDate> activityDates = activities.stream()
                .filter(a -> a.getCreatedAt() != null)
                .map(a -> a.getCreatedAt().toLocalDate())
                .collect(Collectors.toSet());

        LocalDate currentDate = LocalDate.now();

        if (!activityDates.contains(currentDate)) {
            currentDate = currentDate.minusDays(1);
        }

        int streak = 0;

        while (activityDates.contains(currentDate)) {
            streak++;
            currentDate = currentDate.minusDays(1);
        }

        boolean eligible =
                streak >= 7 &&
                        totalActivities >= 7 &&
                        totalEmission > 0;

        int ecoPoints = (int) Math.round(totalActivities * 20);

        List<LeaderboardResponse> leaderboard =
                leaderboardService.getLeaderboard();

        int rank = 0;

        for (int i = 0; i < leaderboard.size(); i++) {
            if (leaderboard.get(i).getId().equals(user.getId())) {
                rank = i + 1;
                break;
            }
        }

        List<String> badges = new ArrayList<>();

        if (streak >= 7)
            badges.add("🔥 7 Day Streak");

        if (totalEmission <= 25)
            badges.add("🌍 Low Carbon Hero");

        if (ecoPoints >= 200)
            badges.add("⭐ Eco Champion");

        if (totalActivities >= 25)
            badges.add("🥇 Activity Master");

        if (totalEmission <= 10)
            badges.add("🌿 Zero Carbon Star");

        if (rank > 0 && rank <= 3)
            badges.add("🏆 Community Leader");

        return CertificateResponse.builder()
                .fullName(user.getFullName())
                .totalActivities(totalActivities)
                .totalEmission(Math.round(totalEmission * 100.0) / 100.0)
                .currentStreak(streak)
                .ecoPoints(ecoPoints)
                .communityRank(rank)
                .eligible(eligible)
                .issueDate(
                        java.time.LocalDate.now()
                                .format(java.time.format.DateTimeFormatter.ofPattern("dd MMMM yyyy"))
                )
                .badges(badges)
                .build();
    }
}