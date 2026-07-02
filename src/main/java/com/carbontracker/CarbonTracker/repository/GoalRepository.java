package com.carbontracker.CarbonTracker.repository;

import com.carbontracker.CarbonTracker.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {

}