package com.carbontracker.CarbonTracker.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SidebarResponse {

    private List<ContributorDto> topContributors;
    private List<SharedBadgeDto> latestBadges;
    private List<NewMemberDto> newMembers;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ContributorDto {
        private Long userId;
        private String fullName;
        private Double carbonSaved;
        private int rank;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SharedBadgeDto {
        private String badgeName;
        private String badgeIcon;
        private String userFullName;
        private LocalDateTime sharedAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NewMemberDto {
        private Long userId;
        private String fullName;
        private LocalDateTime joinedAt;
    }
}
