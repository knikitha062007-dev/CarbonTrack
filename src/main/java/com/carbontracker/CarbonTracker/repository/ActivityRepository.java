package com.carbontracker.CarbonTracker.repository;

import com.carbontracker.CarbonTracker.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
}