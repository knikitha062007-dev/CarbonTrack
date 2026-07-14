package com.carbontracker.CarbonTracker.repository;

import com.carbontracker.CarbonTracker.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    List<ActivityLog> findByLogDate(LocalDate logDate);

    List<ActivityLog> findByLogDateBetween(LocalDate start, LocalDate end);

    @Query("SELECT SUM(a.co2Emission) FROM ActivityLog a WHERE a.logDate = :date")
    Double getDailyEmission(LocalDate date);

    @Query("SELECT SUM(a.co2Emission) FROM ActivityLog a WHERE a.logDate BETWEEN :start AND :end")
    Double getEmissionBetween(LocalDate start, LocalDate end);
}