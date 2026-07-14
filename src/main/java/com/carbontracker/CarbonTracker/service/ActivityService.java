package com.carbontracker.CarbonTracker.service;

import com.carbontracker.CarbonTracker.entity.Activity;
import com.carbontracker.CarbonTracker.entity.User;
import java.util.List;

public interface ActivityService {

    Activity saveActivity(Activity activity, User user);

    List<Activity> getUserActivities(User user);

    void deleteActivity(Long id, User user);

    Activity updateActivity(Long id, Activity activity, User user);
}