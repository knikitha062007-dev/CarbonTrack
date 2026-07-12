package com.carbontracker.CarbonTracker.service;

import com.carbontracker.CarbonTracker.entity.ActivityType;
import org.springframework.stereotype.Service;

@Service
public class EmissionCalculatorService {

    public double calculate(ActivityType type,
                            String subType,
                            double quantity) {

        double factor = 0;

        switch (type) {

            case TRANSPORT:

                switch (subType.toUpperCase()) {

                    case "CAR":
                        factor = 0.19;
                        break;

                    case "BUS":
                        factor = 0.08;
                        break;

                    case "FLIGHT":
                        factor = 0.25;
                        break;

                    default:
                        factor = 0;
                }

                break;

            case ELECTRICITY:
                factor = 0.82;
                break;

            case FOOD:

                switch (subType.toUpperCase()) {

                    case "VEG":
                        factor = 1.5;
                        break;

                    case "NON_VEG":
                        factor = 3.5;
                        break;

                    default:
                        factor = 0;
                }

                break;

            case SHOPPING:
                factor = 0.50;
                break;
        }

        return quantity * factor;
    }

}