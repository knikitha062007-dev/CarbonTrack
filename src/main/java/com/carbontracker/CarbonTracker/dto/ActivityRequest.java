package com.carbontracker.CarbonTracker.dto;

import com.carbontracker.CarbonTracker.entity.ActivityType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class ActivityRequest {

    @NotNull
    private Long userId;

    @NotNull
    private ActivityType activityType;

    @NotBlank
    private String subType;

    @Positive
    private Double quantity;

    @NotBlank
    private String unit;
}