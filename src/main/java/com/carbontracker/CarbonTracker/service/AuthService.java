package com.carbontracker.CarbonTracker.service;

import com.carbontracker.CarbonTracker.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.carbontracker.CarbonTracker.dto.RegisterRequest;
import com.carbontracker.CarbonTracker.dto.RegisterResponse;
import com.carbontracker.CarbonTracker.entity.User;
import java.time.LocalDateTime;
import com.carbontracker.CarbonTracker.dto.LoginRequest;
import com.carbontracker.CarbonTracker.dto.LoginResponse;
import com.carbontracker.CarbonTracker.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }
    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setPreferredUnit(request.getPreferredUnit());
        user.setGoalVisibility(request.getGoalVisibility());

        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                "User registered successfully."
        );
    }
    public LoginResponse login(LoginRequest request) {

        System.out.println("LOGIN METHOD CALLED");
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        System.out.println("Email entered: " + request.getEmail());
        System.out.println("User found: " + user.getEmail());


        System.out.println("Password entered: " + request.getPassword());
        System.out.println("Password in DB: " + user.getPassword());
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        String token = jwtService.generateToken(user.getEmail());
        System.out.println("TOKEN = " + token);

        return new LoginResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail()
        );
    }
}