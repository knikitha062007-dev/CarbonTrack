package com.carbontracker.CarbonTracker.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(name = "preferred_unit", length = 20)
    private String preferredUnit;

    @Column(name = "goal_visibility")
    private Boolean goalVisibility;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}