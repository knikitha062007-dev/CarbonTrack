package com.carbontracker.CarbonTracker.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "activities")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActivityType activityType;

    @Column(nullable = false)
    private Double quantity;

    @Column(nullable = false)
    private Double emission;

    @Column(nullable = false)
    private String unit;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private String subType;
}