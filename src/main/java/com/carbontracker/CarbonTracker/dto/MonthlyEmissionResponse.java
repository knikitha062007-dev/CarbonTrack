package com.carbontracker.CarbonTracker.dto;

public class MonthlyEmissionResponse {

    private String month;
    private Double emission;

    public MonthlyEmissionResponse(String month, Double emission) {
        this.month = month;
        this.emission = emission;
    }

    public String getMonth() {
        return month;
    }

    public Double getEmission() {
        return emission;
    }
}