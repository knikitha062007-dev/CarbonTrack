package com.carbontracker.CarbonTracker.controller;

import com.carbontracker.CarbonTracker.dto.*;
import com.carbontracker.CarbonTracker.entity.User;
import com.carbontracker.CarbonTracker.repository.UserRepository;
import com.carbontracker.CarbonTracker.service.DashboardService;
import com.carbontracker.CarbonTracker.service.RecommendationService;
import com.carbontracker.CarbonTracker.service.ai.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AIController {

    private final GeminiService geminiService;
    private final RecommendationService recommendationService;
    private final DashboardService dashboardService;
    private final UserRepository userRepository;

    @PostMapping("/chat")
    public AIChatResponse chat(
            @RequestBody AIChatRequest request,
            Authentication authentication
    ) {

        User user =
                userRepository.findByEmail(authentication.getName())
                        .orElseThrow();

        DashboardResponse dashboard =
                dashboardService.getDashboard(user);

        RecommendationResponse recommendation =
                recommendationService.getRecommendations(user);

        String prompt =
                """
                You are CarbonTrack Eco Coach.

                User Total Emission:
                %s kg

                Highest Category:
                %s

                Weekly Challenge:
                %s

                Carbon Score:
                %s

                User Question:
                %s

                Give a friendly personalized answer under 150 words.
                """
                        .formatted(
                                dashboard.getTotalEmission(),
                                recommendation.getTopCategory(),
                                recommendation.getWeeklyChallenge(),
                                recommendation.getCarbonScore(),
                                request.getQuestion()
                        );

        String answer =
                geminiService.askGemini(prompt);

        return new AIChatResponse(answer);
    }
}