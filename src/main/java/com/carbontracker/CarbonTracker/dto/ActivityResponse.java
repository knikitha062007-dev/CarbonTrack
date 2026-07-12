package com.carbontracker.CarbonTracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ActivityResponse {

    private Long activityId;

    private String activityType;

    private String subType;

    private Double quantity;

    private String unit;

    private Double emission;

    private String message;
}