package com.carbontracker.CarbonTracker.controller;

import com.carbontracker.CarbonTracker.dto.ProfileResponse;
import com.carbontracker.CarbonTracker.dto.UpdateProfileRequest;
import com.carbontracker.CarbonTracker.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.carbontracker.CarbonTracker.entity.User;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ProfileResponse getProfile(
            @AuthenticationPrincipal User user
    ) {
        return userService.getProfile(user);
    }

    @PutMapping("/profile")
    public ProfileResponse updateProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        return userService.updateProfile(user, request);
    }
}