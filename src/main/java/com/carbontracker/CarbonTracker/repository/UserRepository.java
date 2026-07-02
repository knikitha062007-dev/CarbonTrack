package com.carbontracker.CarbonTracker.repository;

import com.carbontracker.CarbonTracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

}