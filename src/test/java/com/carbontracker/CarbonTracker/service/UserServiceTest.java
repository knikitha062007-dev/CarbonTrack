package com.carbontracker.CarbonTracker.service;

import com.carbontracker.CarbonTracker.entity.User;
import com.carbontracker.CarbonTracker.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    private PasswordEncoder passwordEncoder;
    private UserService userService;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        userService = new UserService(userRepository, passwordEncoder);
    }

    @Test
    void saveUser_ShouldEncodePasswordAndSetCreatedAt() {
        // Given
        User rawUser = User.builder()
                .fullName("John Doe")
                .email("john@example.com")
                .password("plainPassword123")
                .build();

        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        User savedUser = userService.saveUser(rawUser);

        // Then
        assertNotNull(savedUser);
        assertNotNull(savedUser.getCreatedAt());
        
        // Check that password is no longer the plain text password
        assertNotEquals("plainPassword123", savedUser.getPassword());
        
        // Verify that the password is validly hashed with BCrypt
        assertTrue(passwordEncoder.matches("plainPassword123", savedUser.getPassword()));
        
        verify(userRepository, times(1)).save(rawUser);
    }
}
