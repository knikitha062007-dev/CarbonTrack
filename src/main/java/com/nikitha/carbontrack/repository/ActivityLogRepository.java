package com.nikitha.carbontrack.repository;

import com.nikitha.carbontrack.entity.ActivityLog;
import com.nikitha.carbontrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    List<ActivityLog> findByUser(User user);

}