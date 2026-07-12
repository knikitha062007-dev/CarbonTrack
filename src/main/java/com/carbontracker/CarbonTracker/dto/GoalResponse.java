package com.carbontracker.CarbonTracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
public class GoalResponse {

    private Long id;

    private Double targetReduction;

    private LocalDate startDate;

    private LocalDate endDate;

    private Boolean achieved;
}