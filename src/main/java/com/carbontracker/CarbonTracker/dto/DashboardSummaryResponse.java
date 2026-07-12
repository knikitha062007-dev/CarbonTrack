package com.carbontracker.CarbonTracker.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardSummaryResponse {

    private Double totalEmission;

    private Double transportEmission;

    private Double electricityEmission;

    private Double foodEmission;

    private Double shoppingEmission;

    private Double goal;

    private Double goalUsedPercentage;
}