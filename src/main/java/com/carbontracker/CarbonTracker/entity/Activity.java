package com.carbontracker.CarbonTracker.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    @JsonIgnore
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "Activity type is required")
    private ActivityType activityType;

    @Column(nullable = false)
    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be greater than 0")
    private Double quantity;

    @Column(nullable = false)
    private Double emission;

    @Column(nullable = false)
    @NotBlank(message = "Unit is required")
    private String unit;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    @NotBlank(message = "Sub type is required")
    private String subType;


}