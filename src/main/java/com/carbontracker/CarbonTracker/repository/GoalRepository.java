package com.carbontracker.CarbonTracker.repository;

import com.carbontracker.CarbonTracker.entity.Goal;
import com.carbontracker.CarbonTracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GoalRepository extends JpaRepository<Goal, Long> {

    Optional<Goal> findByUser(User user);

}