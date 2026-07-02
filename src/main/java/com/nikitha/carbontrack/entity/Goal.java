package com.nikitha.carbontrack.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "goals")
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "target_reduction_pct", nullable = false)
    private Double targetReductionPct;

    @Column(name = "period_days", nullable = false)
    private Integer periodDays;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Enumerated(EnumType.STRING)
    private GoalStatus status;
}
