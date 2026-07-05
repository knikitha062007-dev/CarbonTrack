package com.nikitha.carbontrack.repository;

import com.nikitha.carbontrack.entity.EmissionFactor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmissionFactorRepository extends JpaRepository<EmissionFactor, Long> {

    Optional<EmissionFactor> findByCategoryAndActivityTypeAndUnit(
            String category,
            String activityType,
            String unit
    );

}