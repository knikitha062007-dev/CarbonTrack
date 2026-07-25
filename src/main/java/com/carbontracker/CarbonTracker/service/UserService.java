package com.carbontracker.CarbonTracker.service;

import com.carbontracker.CarbonTracker.dto.GoalProgressResponse;
import com.carbontracker.CarbonTracker.entity.User;
import com.carbontracker.CarbonTracker.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import com.carbontracker.CarbonTracker.dto.ProfileResponse;
import com.carbontracker.CarbonTracker.dto.UpdateProfileRequest;
import com.carbontracker.CarbonTracker.dto.LandingStatsResponse;
import com.carbontracker.CarbonTracker.repository.ActivityRepository;
import org.springframework.cache.annotation.Cacheable;
import java.util.List;
import com.carbontracker.CarbonTracker.repository.GoalRepository;

@Service           //tells this a business logic
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ActivityRepository activityRepository;
    private final GoalRepository goalRepository;
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       ActivityRepository activityRepository,
                       GoalRepository goalRepository) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.activityRepository = activityRepository;
        this.goalRepository = goalRepository;
    }

    public User saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    public ProfileResponse getProfile(User user) {

        User dbUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new ProfileResponse(
                dbUser.getId(),
                dbUser.getFullName(),
                dbUser.getEmail(),
                dbUser.getPreferredUnit(),
                dbUser.getGoalVisibility(),
                dbUser.getCo2Goal()
        );
    }
    public ProfileResponse updateProfile(User user, UpdateProfileRequest request) {

        User dbuser = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        dbuser.setFullName(request.getFullName());
        dbuser.setEmail(request.getEmail());
        dbuser.setPreferredUnit(request.getPreferredUnit());
        dbuser.setGoalVisibility(request.getGoalVisibility());
        dbuser.setCo2Goal(request.getCo2Goal());

        User updatedUser = userRepository.save(dbuser);

        return new ProfileResponse(
                updatedUser.getId(),
                updatedUser.getFullName(),
                updatedUser.getEmail(),
                updatedUser.getPreferredUnit(),
                updatedUser.getGoalVisibility(),
                updatedUser.getCo2Goal()
        );
    }
    @Cacheable(value = "userCount")
    public Long getUserCount() {
        System.out.println("Fetching user count from PostgreSQL...");
        return userRepository.count();
    }
    public long getActivityCount() {
        return activityRepository.count();
    }
    public GoalProgressResponse getGoalProgress(User user) {

        double totalEmission = activityRepository.getTotalEmissionByUser(user);

        double target = goalRepository.findByUser(user)
                .map(g -> g.getTargetReduction())
                .orElse(20.0);

        double currentReduction = Math.min((totalEmission / 500.0) * 100, 100);

        String status;

        if (currentReduction >= target) {
            status = "Goal Achieved";
        } else if (currentReduction >= target * 0.7) {
            status = "On Track";
        } else {
            status = "Behind Target";
        }

        int weeksRemaining =
                (int) Math.max(1,
                        Math.ceil((target - currentReduction) / 5));

        return GoalProgressResponse.builder()
                .targetReduction(target)
                .currentReduction(currentReduction)
                .status(status)
                .projectedCompletion(
                        status.equals("Goal Achieved")
                                ? "Completed"
                                : weeksRemaining + " Weeks")
                .build();
    }
}