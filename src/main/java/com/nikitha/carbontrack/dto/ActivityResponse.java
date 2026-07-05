package com.nikitha.carbontrack.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityResponse {

    private Long id;
    private String email;
    private String category;
    private String activityType;
    private Double quantity;
    private String unit;
    private Double co2Emission;
    private LocalDate logDate;
}