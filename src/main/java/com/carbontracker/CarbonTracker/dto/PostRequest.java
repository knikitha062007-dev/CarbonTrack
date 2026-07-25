package com.carbontracker.CarbonTracker.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostRequest {

    private String caption;
    private String imageUrl;
    private String postType; // ALL, UPDATE, BADGE, GOAL, TIP
    private List<String> ecoUpdates;
    private String sharedBadgeName;
    private String sharedBadgeIcon;
    private Double sharedGoalTarget;
    private String sustainabilityTip;
    private Double carbonSaved;
}
