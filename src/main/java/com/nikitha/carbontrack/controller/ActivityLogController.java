package com.nikitha.carbontrack.controller;

import com.nikitha.carbontrack.dto.ActivityRequest;
import com.nikitha.carbontrack.dto.ActivityResponse;
import com.nikitha.carbontrack.service.ActivityLogService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "http://localhost:5173")
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    public ActivityLogController(ActivityLogService activityLogService) {
        this.activityLogService = activityLogService;
    }

    // Transport
    @PostMapping("/transport")
    public ActivityResponse addTransportActivity(@Valid @RequestBody ActivityRequest request) {
        request.setCategory("Transport");
        return activityLogService.saveActivity(request);
    }

    // Electricity
    @PostMapping("/electricity")
    public ActivityResponse addElectricityActivity(@Valid @RequestBody ActivityRequest request) {
        request.setCategory("Electricity");
        return activityLogService.saveActivity(request);
    }

    // Food
    @PostMapping("/food")
    public ActivityResponse addFoodActivity(@Valid @RequestBody ActivityRequest request) {
        request.setCategory("Food");
        return activityLogService.saveActivity(request);
    }

    // Shopping
    @PostMapping("/shopping")
    public ActivityResponse addShoppingActivity(@Valid @RequestBody ActivityRequest request) {
        request.setCategory("Shopping");
        return activityLogService.saveActivity(request);
    }

    // Get all activities of a user
    @GetMapping
    public List<ActivityResponse> getUserActivities(@RequestParam String email) {
        return activityLogService.getUserActivities(email);
    }
}