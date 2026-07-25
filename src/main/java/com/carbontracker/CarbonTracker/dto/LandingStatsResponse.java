package com.carbontracker.CarbonTracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LandingStatsResponse {

    private Long totalUsers;
    private Long totalActivities;
    private Double totalEmission;
}