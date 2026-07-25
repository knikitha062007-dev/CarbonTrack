package com.carbontracker.CarbonTracker.controller;

import com.carbontracker.CarbonTracker.dto.DashboardResponse;
import com.carbontracker.CarbonTracker.dto.MonthlyEmissionResponse;
import com.carbontracker.CarbonTracker.entity.User;
import com.carbontracker.CarbonTracker.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.carbontracker.CarbonTracker.dto.WeeklyEmissionResponse;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public DashboardResponse getDashboard(
            @AuthenticationPrincipal User user
    ) {
        return dashboardService.getDashboard(user);
    }
    @GetMapping("/weekly")
    public List<WeeklyEmissionResponse> getWeeklyEmission(
            @AuthenticationPrincipal User user
    ) {
        return dashboardService.getWeeklyEmission(user);
    }
    @GetMapping("/monthly")
    public List<MonthlyEmissionResponse> getMonthlyChart(
            @AuthenticationPrincipal User user) {

        return dashboardService.getMonthlyEmission(user);
    }
}