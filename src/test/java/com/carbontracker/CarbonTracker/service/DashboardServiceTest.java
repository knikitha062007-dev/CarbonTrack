package com.carbontracker.CarbonTracker.service;

import com.carbontracker.CarbonTracker.dto.DashboardResponse;
import com.carbontracker.CarbonTracker.entity.Goal;
import com.carbontracker.CarbonTracker.entity.User;
import com.carbontracker.CarbonTracker.repository.ActivityRepository;
import com.carbontracker.CarbonTracker.repository.GoalRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private ActivityRepository activityRepository;

    @Mock
    private GoalRepository goalRepository;

    @InjectMocks
    private DashboardService dashboardService;

    @Test
    void shouldReturnDashboardSummary() {

        User user = User.builder()
                .id(1L)
                .fullName("Priya")
                .email("priya@gmail.com")
                .password("123")
                .preferredUnit("kg")
                .goalVisibility(true)
                .createdAt(LocalDateTime.now())
                .build();

        Goal goal = Goal.builder()
                .id(1L)
                .user(user)
                .targetReduction(500.0)
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusMonths(1))
                .achieved(false)
                .build();

        when(activityRepository.getTotalEmissionByUser(user)).thenReturn(71.892);
        when(activityRepository.getTransportEmission(user)).thenReturn(1.152);
        when(activityRepository.getElectricityEmission(user)).thenReturn(5.74);
        when(activityRepository.getFoodEmission(user)).thenReturn(5.0);
        when(activityRepository.getShoppingEmission(user)).thenReturn(60.0);
        when(activityRepository.countByUser(user)).thenReturn(4L);

        when(goalRepository.findByUser(user))
                .thenReturn(Optional.of(goal));

        DashboardResponse response = dashboardService.getDashboard(user);

        assertEquals(71.892, response.getTotalEmission());
        assertEquals(1.152, response.getTransportEmission());
        assertEquals(5.74, response.getElectricityEmission());
        assertEquals(5.0, response.getFoodEmission());
        assertEquals(60.0, response.getShoppingEmission());
        assertEquals(4L, response.getTotalActivities());
        assertEquals(500.0, response.getGoal());
    }
}