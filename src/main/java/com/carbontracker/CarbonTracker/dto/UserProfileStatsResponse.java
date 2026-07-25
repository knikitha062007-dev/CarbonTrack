package com.carbontracker.CarbonTracker.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileStatsResponse {

    private Long id;
    private String fullName;
    private int rank;
    private Double carbonSaved;
    private int streak;
    private List<BadgeDetailsDto> badges;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BadgeDetailsDto {
        private String id;
        private String name;
        private String desc;
        private String icon;
        private boolean unlocked;
    }
}
