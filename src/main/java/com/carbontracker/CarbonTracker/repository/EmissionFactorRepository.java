package com.carbontracker.CarbonTracker.repository;

import com.carbontracker.CarbonTracker.entity.EmissionFactor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmissionFactorRepository extends JpaRepository<EmissionFactor, Long> {

}