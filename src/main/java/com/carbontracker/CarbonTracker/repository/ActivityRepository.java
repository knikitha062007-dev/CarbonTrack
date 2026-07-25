package com.carbontracker.CarbonTracker.repository;

import com.carbontracker.CarbonTracker.dto.MonthlyEmissionResponse;
import com.carbontracker.CarbonTracker.entity.Activity;
import com.carbontracker.CarbonTracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.carbontracker.CarbonTracker.dto.WeeklyEmissionResponse;
import com.carbontracker.CarbonTracker.dto.WeeklyEmissionResponse;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

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
    @Query("SELECT COALESCE(SUM(a.emission),0) FROM Activity a")
    Double getPlatformEmission();
    List<Activity> findByUserAndCreatedAtAfter(User user, LocalDateTime startDate);
    @Query("""
SELECT new com.carbontracker.CarbonTracker.dto.MonthlyEmissionResponse(
    CONCAT('', MONTH(a.createdAt)),
    SUM(a.emission)
)
FROM Activity a
WHERE a.user = :user
GROUP BY MONTH(a.createdAt)
ORDER BY MONTH(a.createdAt)
""")
    List<MonthlyEmissionResponse> getMonthlyEmission(User user);
    Long countByUser(User user);

    @Query("SELECT a.user, SUM(a.emission) FROM Activity a GROUP BY a.user ORDER BY SUM(a.emission) ASC")
    List<Object[]> getLeaderboardData();
    @Query("""
SELECT COALESCE(SUM(a.emission), 0)
FROM Activity a
WHERE a.user = :user
AND CAST(a.createdAt AS date) = CURRENT_DATE
""")
    Double getTodayEmission(@Param("user") User user);
}