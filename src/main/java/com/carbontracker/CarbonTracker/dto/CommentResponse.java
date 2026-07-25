package com.carbontracker.CarbonTracker.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentResponse {

    private Long id;
    private Long userId;
    private String userFullName;
    private String content;
    private LocalDateTime createdAt;
}
