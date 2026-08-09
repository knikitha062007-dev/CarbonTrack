package com.carbontracker.CarbonTracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComparisonResponse {

    private double today;
    private double yesterday;

    private double thisWeek;
    private double lastWeek;

    private double thisMonth;
    private double lastMonth;
}