package com.carbontracker.CarbonTracker.service;

import com.carbontracker.CarbonTracker.dto.RecommendationResponse;
import com.carbontracker.CarbonTracker.entity.User;
import com.carbontracker.CarbonTracker.repository.ActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final ActivityRepository activityRepository;


    public RecommendationResponse getRecommendations(User user) {

        double transport = activityRepository.getTransportEmission(user);
        double electricity = activityRepository.getElectricityEmission(user);
        double food = activityRepository.getFoodEmission(user);
        double shopping = activityRepository.getShoppingEmission(user);

        double total = activityRepository.getTotalEmissionByUser(user);

        String topCategory = "";
        double topEmission = transport;

        if (electricity > topEmission) {
            topEmission = electricity;
            topCategory = "Electricity";
        } else {
            topCategory = "Transport";
        }

        if (food > topEmission) {
            topEmission = food;
            topCategory = "Food";
        }

        if (shopping > topEmission) {
            topEmission = shopping;
            topCategory = "Shopping";
        }

        double percentage = total == 0 ? 0 : (topEmission / total) * 100;

        String r1 = "";
        String r2 = "";
        String r3 = "";
        double saving = 0;
        String challenge = "";

        switch (topCategory) {

            case "Transport":
                r1 = "Walk for trips under 2 km";
                r2 = "Use public transport twice this week";
                r3 = "Carpool whenever possible";
                saving = 6.5;
                challenge = "Avoid using your bike for one short trip today.";
                break;

            case "Electricity":
                r1 = "Turn off appliances when not in use";
                r2 = "Use LED bulbs";
                r3 = "Limit AC usage by one hour daily";
                saving = 3.2;
                challenge = "Reduce electricity consumption today.";
                break;

            case "Food":
                r1 = "Choose one plant-based meal this week";
                r2 = "Reduce food waste";
                r3 = "Buy locally produced food";
                saving = 2.4;
                challenge = "Eat one eco-friendly meal today.";
                break;

            case "Shopping":
                r1 = "Avoid unnecessary purchases";
                r2 = "Reuse existing products";
                r3 = "Buy sustainable brands";
                saving = 2.0;
                challenge = "Don't buy anything non-essential today.";
                break;
        }


        double goal = user.getCo2Goal();

        int carbonScore;

        if (goal <= 0 || total <= 0) {
            carbonScore = 100;
        } else {

            double goalUsed = (total / goal) * 100;

            if (goalUsed <= 50)
                carbonScore = 100;
            else if (goalUsed >= 150)
                carbonScore = 0;
            else
                carbonScore = (int) Math.round(150 - goalUsed);
        }
        return RecommendationResponse.builder()
                .topCategory(topCategory)
                .categoryEmission(topEmission)
                .percentage(percentage)
                .recommendation1(r1)
                .recommendation2(r2)
                .recommendation3(r3)
                .possibleSaving(saving)
                .weeklyChallenge(challenge)
                .carbonScore(carbonScore)
                .build();
    }
}