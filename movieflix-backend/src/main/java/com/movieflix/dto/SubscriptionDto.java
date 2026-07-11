package com.movieflix.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionDto {
    private Long id;
    private String type;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private boolean active;
}