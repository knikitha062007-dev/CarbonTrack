package com.carbontracker.CarbonTracker.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @NotBlank
    private String fullName;

    @Email
    private String email;

    private String preferredUnit;

    private Boolean goalVisibility;
}