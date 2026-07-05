package com.carbontracker.CarbonTracker.controller;

import com.carbontracker.CarbonTracker.dto.ProfileResponse;
import com.carbontracker.CarbonTracker.dto.UpdateProfileRequest;
import com.carbontracker.CarbonTracker.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ProfileResponse getProfile(@PathVariable Long id) {
        return userService.getProfile(id);
    }

    @PutMapping("/{id}")
    public ProfileResponse updateProfile(@PathVariable Long id,
                                         @Valid @RequestBody UpdateProfileRequest request) {
        return userService.updateProfile(id, request);
    }
}