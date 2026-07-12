package com.carbontracker.CarbonTracker.entity;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "badges")
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "badge_name", nullable = false, length = 100)
    private String badgeName;

    @Column(nullable = false, length = 255)
    private String description;

    @Column(name = "badge_level", length = 50)
    private String badgeLevel;
}