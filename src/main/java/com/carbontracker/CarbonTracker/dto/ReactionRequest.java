package com.carbontracker.CarbonTracker.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReactionRequest {

    @NotBlank(message = "Reaction type is required")
    private String reactionType; // INSPIRED, GREAT_CHOICE, APPRECIATE, MOTIVATED
}
