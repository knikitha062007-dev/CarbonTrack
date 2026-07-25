package com.carbontracker.CarbonTracker.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String caption;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "post_type", nullable = false, length = 50)
    private String postType;

    @Column(name = "eco_updates", columnDefinition = "TEXT")
    private String ecoUpdates;

    @Column(name = "shared_badge_name", length = 100)
    private String sharedBadgeName;

    @Column(name = "shared_badge_icon", length = 50)
    private String sharedBadgeIcon;

    @Column(name = "shared_goal_target")
    private Double sharedGoalTarget;

    @Column(name = "sustainability_tip", columnDefinition = "TEXT")
    private String sustainabilityTip;

    @Column(name = "carbon_saved")
    private Double carbonSaved;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
