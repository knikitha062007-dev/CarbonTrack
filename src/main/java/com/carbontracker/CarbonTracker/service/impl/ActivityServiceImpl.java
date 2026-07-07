package com.carbontracker.CarbonTracker.service.impl;

import com.carbontracker.CarbonTracker.entity.Activity;
import com.carbontracker.CarbonTracker.entity.User;
import com.carbontracker.CarbonTracker.repository.ActivityRepository;
import com.carbontracker.CarbonTracker.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityServiceImpl implements ActivityService {

    private final ActivityRepository activityRepository;

    @Override
    public Activity saveActivity(Activity activity, User user) {

        activity.setUser(user);
        activity.setCreatedAt(LocalDateTime.now());

        return activityRepository.save(activity);
    }

    @Override
    public List<Activity> getUserActivities(User user) {
        return activityRepository.findByUser(user);
    }

    @Override
    public void deleteActivity(Long id, User user) {

        Activity activity = activityRepository.findById(id)
                .orElseThrow();

        if(activity.getUser().getId().equals(user.getId())){
            activityRepository.delete(activity);
        }
    }
}