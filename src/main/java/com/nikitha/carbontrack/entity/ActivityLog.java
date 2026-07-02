package com.nikitha.carbontrack.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "activity_logs")
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String category;

    @Column(name = "activity_type", nullable = false)
    private String activityType;

    @Column(nullable = false)
    private Double quantity;

    @Column(nullable = false)
    private String unit;

    @Column(name = "co2e_kg")
    private Double co2eKg;

    @Column(name = "log_date")
    private LocalDate logDate;

    public ActivityLog() {
    }

    // Generate Getters and Setters using IntelliJ
}
