package com.carbontracker.CarbonTracker.service;

import com.carbontracker.CarbonTracker.entity.User;
import com.carbontracker.CarbonTracker.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

import java.util.List;

@Service           //tells this a business logic
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User saveUser(User user) {
        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}