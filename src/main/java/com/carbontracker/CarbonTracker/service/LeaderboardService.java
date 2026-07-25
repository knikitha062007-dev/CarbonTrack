package com.carbontracker.CarbonTracker.service;

import com.carbontracker.CarbonTracker.dto.LeaderboardResponse;
import com.carbontracker.CarbonTracker.entity.User;
import com.carbontracker.CarbonTracker.repository.ActivityRepository;
import com.carbontracker.CarbonTracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    public List<LeaderboardResponse> getLeaderboard() {
        List<Object[]> results = activityRepository.getLeaderboardData();
        List<LeaderboardResponse> leaderboard = new ArrayList<>();
        Set<Long> userIdsWithActivities = new HashSet<>();

        for (Object[] row : results) {
            User user = (User) row[0];
            Double totalEmission = (Double) row[1];
            if (user != null) {
                userIdsWithActivities.add(user.getId());
                double roundedEmission = totalEmission != null ? Math.round(totalEmission * 10.0) / 10.0 : 0.0;
                leaderboard.add(new LeaderboardResponse(user.getId(), user.getFullName(), roundedEmission));
            }
        }

        // Add remaining users who have no activities with 0.0 emission
        List<User> allUsers = userRepository.findAll();
        for (User user : allUsers) {
            if (!userIdsWithActivities.contains(user.getId())) {
                leaderboard.add(new LeaderboardResponse(user.getId(), user.getFullName(), 0.0));
            }
        }

        // Sort by emission ascending
        leaderboard.sort(Comparator.comparingDouble(LeaderboardResponse::getTotalEmission));

        return leaderboard;
    }
}
