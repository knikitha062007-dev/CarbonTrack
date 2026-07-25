package com.carbontracker.CarbonTracker.service;

import com.carbontracker.CarbonTracker.dto.ActivityRequest;
import com.carbontracker.CarbonTracker.entity.Activity;
import com.carbontracker.CarbonTracker.entity.User;
import org.springframework.cache.annotation.CacheEvict;

import java.util.List;

public interface ActivityService {
    @CacheEvict(value = "dashboard", key = "#user.id")
    Activity saveActivity(Activity activity, User user);

    List<Activity> getUserActivities(User user);

    void deleteActivity(Long id, User user);

    Activity updateActivity(Long id, ActivityRequest request, User user);
}