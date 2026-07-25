package com.carbontracker.CarbonTracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationResponse {

    private String topCategory;

    private double categoryEmission;

    private double percentage;

    private String recommendation1;

    private String recommendation2;

    private String recommendation3;

    private double possibleSaving;

    private String weeklyChallenge;

    private int carbonScore;
}