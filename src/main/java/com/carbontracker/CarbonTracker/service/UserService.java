package com.carbontracker.CarbonTracker.service;

import com.carbontracker.CarbonTracker.entity.User;
import com.carbontracker.CarbonTracker.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import com.carbontracker.CarbonTracker.dto.ProfileResponse;
import com.carbontracker.CarbonTracker.dto.UpdateProfileRequest;

import java.util.List;

@Service           //tells this a business logic
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    public ProfileResponse getProfile(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new ProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPreferredUnit(),
                user.getGoalVisibility()
        );
    }
    public ProfileResponse updateProfile(Long id, UpdateProfileRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPreferredUnit(request.getPreferredUnit());
        user.setGoalVisibility(request.getGoalVisibility());

        User updatedUser = userRepository.save(user);

        return new ProfileResponse(
                updatedUser.getId(),
                updatedUser.getFullName(),
                updatedUser.getEmail(),
                updatedUser.getPreferredUnit(),
                updatedUser.getGoalVisibility()
        );
    }
}