package com.nikitha.carbontrack.service;

import com.nikitha.carbontrack.dto.AuthResponse;
import com.nikitha.carbontrack.dto.LoginRequest;
import com.nikitha.carbontrack.dto.RegisterRequest;
import com.nikitha.carbontrack.dto.UpdateProfileRequest;
import com.nikitha.carbontrack.dto.UserProfileResponse;
import com.nikitha.carbontrack.entity.User;
import com.nikitha.carbontrack.repository.UserRepository;
import com.nikitha.carbontrack.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // Register User
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .preferredUnit(request.getPreferredUnit())
                .goalVisibility(true)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(token, "Registration Successful");
    }

    // Login User
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(token, "Login Successful");
    }

    // Save User
    public User saveUser(User user) {
        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    // Get All Users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get User Profile
    public UserProfileResponse getProfile(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .preferredUnit(user.getPreferredUnit())
                .build();
    }

    // Update User Profile
    public UserProfileResponse updateProfile(String email,
                                             UpdateProfileRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(request.getFullName());
        user.setPreferredUnit(request.getPreferredUnit());

        userRepository.save(user);

        return UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .preferredUnit(user.getPreferredUnit())
                .build();
    }
}