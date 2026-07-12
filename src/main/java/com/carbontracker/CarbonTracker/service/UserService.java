package com.carbontracker.CarbonTracker.service;

import com.carbontracker.CarbonTracker.dto.ProfileResponse;
import com.carbontracker.CarbonTracker.dto.UpdateProfileRequest;
import com.carbontracker.CarbonTracker.entity.User;
import com.carbontracker.CarbonTracker.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
    public ProfileResponse getProfile(User user) {

        User dbUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new ProfileResponse(
                dbUser.getId(),
                dbUser.getFullName(),
                dbUser.getEmail(),
                dbUser.getPreferredUnit(),
                dbUser.getGoalVisibility()
        );
    }
    public ProfileResponse updateProfile(User user, UpdateProfileRequest request) {

        User dbuser = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        dbuser.setFullName(request.getFullName());
        dbuser.setEmail(request.getEmail());
        dbuser.setPreferredUnit(request.getPreferredUnit());
        dbuser.setGoalVisibility(request.getGoalVisibility());

        User updatedUser = userRepository.save(dbuser);

        return new ProfileResponse(
                updatedUser.getId(),
                updatedUser.getFullName(),
                updatedUser.getEmail(),
                updatedUser.getPreferredUnit(),
                updatedUser.getGoalVisibility()
        );
    }
}