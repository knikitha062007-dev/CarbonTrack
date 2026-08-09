package com.carbontracker.CarbonTracker.controller;

import com.carbontracker.CarbonTracker.dto.ComparisonResponse;
import com.carbontracker.CarbonTracker.entity.User;
import com.carbontracker.CarbonTracker.service.ComparisonService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/comparison")
@RequiredArgsConstructor
public class ComparisonController {

    private final ComparisonService comparisonService;

    @GetMapping
    public ComparisonResponse getComparison(
            @AuthenticationPrincipal User user) {

        return comparisonService.getComparison(user);
    }
}