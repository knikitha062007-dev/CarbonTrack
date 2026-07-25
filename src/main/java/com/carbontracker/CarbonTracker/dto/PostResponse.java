package com.carbontracker.CarbonTracker.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostResponse {

    private Long id;
    private Long userId;
    private String userFullName;
    private String caption;
    private String imageUrl;
    private String postType;
    private List<String> ecoUpdates;
    private String sharedBadgeName;
    private String sharedBadgeIcon;
    private Double sharedGoalTarget;
    private String sustainabilityTip;
    private Double carbonSaved;
    private LocalDateTime createdAt;

    private long likesCount;
    private boolean likedByMe;
    private long commentsCount;
    private Map<String, Long> reactionsCount;
    private String myReaction; // e.g. "INSPIRED", "GREAT_CHOICE", "APPRECIATE", "MOTIVATED" or null
}
