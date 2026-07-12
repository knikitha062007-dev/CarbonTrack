package com.carbontracker.CarbonTracker.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class GoalRequest {

    private Double targetReduction;

    private LocalDate startDate;

    private LocalDate endDate;
}