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

    // Controls whether this user's name is visible on the leaderboard
    private Boolean showNameOnLeaderboard;

    private Double co2Goal;
}