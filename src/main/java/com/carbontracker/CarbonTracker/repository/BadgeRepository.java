package com.carbontracker.CarbonTracker.repository;

import com.carbontracker.CarbonTracker.entity.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BadgeRepository extends JpaRepository<Badge, Long> {

}