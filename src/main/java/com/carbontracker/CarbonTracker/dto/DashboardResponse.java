package com.carbontracker.CarbonTracker.dto;

import lombok.*;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    private Double totalEmission;
    private Double transportEmission;
    private Double electricityEmission;
    private Double foodEmission;
    private Double shoppingEmission;
    private Long totalActivities;
    private Double goal;
    private Double goalPercentage;
    private Double dailyGoal;
    private Double todayEmission;
    private Double remainingToday;
    private Double dailyProgress;
    private String dailyStatus;
    private double dailyComparison;
    private double weeklyComparison;
    private double monthlyComparison;
}