package com.carbontracker.CarbonTracker.repository;

import com.carbontracker.CarbonTracker.entity.Activity;
import com.carbontracker.CarbonTracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

    List<Activity> findByUser(User user);
    @Query("SELECT COALESCE(SUM(a.emission),0) FROM Activity a WHERE a.user = :user")
    Double getTotalEmissionByUser(User user);

    @Query("SELECT COALESCE(SUM(a.emission),0) FROM Activity a WHERE a.user = :user AND a.activityType='TRANSPORT'")
    Double getTransportEmission(User user);

    @Query("SELECT COALESCE(SUM(a.emission),0) FROM Activity a WHERE a.user = :user AND a.activityType='ELECTRICITY'")
    Double getElectricityEmission(User user);

    @Query("SELECT COALESCE(SUM(a.emission),0) FROM Activity a WHERE a.user = :user AND a.activityType='FOOD'")
    Double getFoodEmission(User user);

    @Query("SELECT COALESCE(SUM(a.emission),0) FROM Activity a WHERE a.user = :user AND a.activityType='SHOPPING'")
    Double getShoppingEmission(User user);

    Long countByUser(User user);

}