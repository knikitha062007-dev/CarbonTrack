package com.carbontracker.CarbonTracker.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoalProgressResponse {

    private Double targetReduction;
    private Double currentReduction;
    private String status;
    private String projectedCompletion;

}