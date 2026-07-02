package com.nikitha.carbontrack.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "emission_factors")
public class EmissionFactor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "activity_type", nullable = false)
    private String activityType;

    @Column(nullable = false)
    private String unit;

    @Column(name = "kg_co2e_per_unit", nullable = false)
    private Double kgCo2ePerUnit;

    @Column(nullable = false)
    private String source;

    @Column(name = "effective_date")
    private LocalDate effectiveDate;
}
