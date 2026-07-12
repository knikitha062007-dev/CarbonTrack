package com.carbontracker.CarbonTracker.controller;

import com.carbontracker.CarbonTracker.dto.RegisterRequest;
import com.carbontracker.CarbonTracker.dto.RegisterResponse;
import com.carbontracker.CarbonTracker.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import com.carbontracker.CarbonTracker.dto.LoginRequest;
import com.carbontracker.CarbonTracker.dto.LoginResponse;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public RegisterResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }
    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}