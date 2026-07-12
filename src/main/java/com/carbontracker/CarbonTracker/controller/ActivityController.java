package com.carbontracker.CarbonTracker.controller;

import com.carbontracker.CarbonTracker.entity.Activity;
import com.carbontracker.CarbonTracker.entity.User;
import com.carbontracker.CarbonTracker.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/activities")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ActivityController {

    private final ActivityService activityService;

    @PostMapping
    public Activity saveActivity(
            @Valid @RequestBody Activity activity,
            @AuthenticationPrincipal User user
    ) {
        return activityService.saveActivity(activity, user);
    }

    @GetMapping
    public List<Activity> getActivities(
            @AuthenticationPrincipal User user
    ) {
        return activityService.getUserActivities(user);
    }

    @DeleteMapping("/{id}")
    public void deleteActivity(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        activityService.deleteActivity(id, user);
    }
    @GetMapping("/test")
    public String test(@AuthenticationPrincipal User user) {
        if (user == null) {
            return "User is NULL";
        }
        return "Logged in as: " + user.getEmail();
    }
}