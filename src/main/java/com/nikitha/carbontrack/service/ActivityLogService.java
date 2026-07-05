package com.nikitha.carbontrack.service;

import com.nikitha.carbontrack.dto.ActivityRequest;
import com.nikitha.carbontrack.dto.ActivityResponse;
import com.nikitha.carbontrack.entity.ActivityLog;
import com.nikitha.carbontrack.entity.EmissionFactor;
import com.nikitha.carbontrack.entity.User;
import com.nikitha.carbontrack.repository.ActivityLogRepository;
import com.nikitha.carbontrack.repository.EmissionFactorRepository;
import com.nikitha.carbontrack.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;
    private final UserRepository userRepository;
    private final EmissionFactorRepository emissionFactorRepository;

    public ActivityLogService(ActivityLogRepository activityLogRepository,
                              UserRepository userRepository,
                              EmissionFactorRepository emissionFactorRepository) {
        this.activityLogRepository = activityLogRepository;
        this.userRepository = userRepository;
        this.emissionFactorRepository = emissionFactorRepository;
    }

    public ActivityResponse saveActivity(ActivityRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        EmissionFactor emissionFactor = emissionFactorRepository
                .findByCategoryAndActivityTypeAndUnit(
                        request.getCategory(),
                        request.getActivityType(),
                        request.getUnit())
                .orElseThrow(() -> new RuntimeException("Emission factor not found"));

        double co2Emission = request.getQuantity() * emissionFactor.getEmissionFactor();

        ActivityLog activity = ActivityLog.builder()
                .user(user)
                .category(request.getCategory())
                .activityType(request.getActivityType())
                .quantity(request.getQuantity())
                .unit(request.getUnit())
                .co2Emission(co2Emission)
                .logDate(LocalDate.now())
                .build();

        activity = activityLogRepository.save(activity);

        return ActivityResponse.builder()
                .id(activity.getId())
                .email(user.getEmail())
                .category(activity.getCategory())
                .activityType(activity.getActivityType())
                .quantity(activity.getQuantity())
                .unit(activity.getUnit())
                .co2Emission(activity.getCo2Emission())
                .logDate(activity.getLogDate())
                .build();
    }

    public List<ActivityResponse> getUserActivities(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return activityLogRepository.findByUser(user)
                .stream()
                .map(activity -> ActivityResponse.builder()
                        .id(activity.getId())
                        .email(user.getEmail())
                        .category(activity.getCategory())
                        .activityType(activity.getActivityType())
                        .quantity(activity.getQuantity())
                        .unit(activity.getUnit())
                        .co2Emission(activity.getCo2Emission())
                        .logDate(activity.getLogDate())
                        .build())
                .collect(Collectors.toList());
    }
}