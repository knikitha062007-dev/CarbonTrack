package com.carbontracker.CarbonTracker.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private Double totalEmission;

    private Double transportEmission;

    private Double electricityEmission;

    private Double foodEmission;

    private Double shoppingEmission;

    private Long totalActivities;

    private Double goal;

    private Double goalPercentage;
}