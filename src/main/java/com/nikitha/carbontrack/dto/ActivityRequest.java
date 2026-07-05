package com.nikitha.carbontrack.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class ActivityRequest {

    @NotBlank(message = "Email is required")
    private String email;

    // Category will be set automatically in the controller
    private String category;

    @NotBlank(message = "Activity type is required")
    private String activityType;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be greater than zero")
    private Double quantity;

    @NotBlank(message = "Unit is required")
    private String unit;
}