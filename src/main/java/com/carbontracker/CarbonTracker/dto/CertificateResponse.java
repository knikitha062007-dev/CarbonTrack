package com.carbontracker.CarbonTracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CertificateResponse {

    private String fullName;

    private Long totalActivities;

    private Double totalEmission;

    private Integer currentStreak;

    private Integer ecoPoints;

    private Integer communityRank;

    private Boolean eligible;

    private String issueDate;

    private List<String> badges;

}