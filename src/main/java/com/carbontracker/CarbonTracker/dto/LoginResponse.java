package com.carbontracker.CarbonTracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {

    private String token;
    private Long id;
    private String fullName;
    private String email;
}