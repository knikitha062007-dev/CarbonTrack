package com.carbontracker.CarbonTracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class WeeklyEmissionResponse {

    private String day;
    private Double emission;

}