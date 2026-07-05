package com.nikitha.carbontrack.controller;

import com.nikitha.carbontrack.dto.AuthResponse;
import com.nikitha.carbontrack.dto.LoginRequest;
import com.nikitha.carbontrack.dto.RegisterRequest;
import com.nikitha.carbontrack.dto.UpdateProfileRequest;
import com.nikitha.carbontrack.dto.UserProfileResponse;
import com.nikitha.carbontrack.entity.User;
import com.nikitha.carbontrack.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Register
    @PostMapping("/auth/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return userService.register(request);
    }

    // Login
    @PostMapping("/auth/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return userService.login(request);
    }

    // Get Profile
    @GetMapping("/users/profile")
    public UserProfileResponse getProfile(@RequestParam String email) {
        return userService.getProfile(email);
    }

    // Update Profile
    @PutMapping("/users/profile")
    public UserProfileResponse updateProfile(
            @RequestParam String email,
            @Valid @RequestBody UpdateProfileRequest request) {

        return userService.updateProfile(email, request);
    }

    // Add User
    @PostMapping("/users")
    public User addUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    // Get All Users
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
}