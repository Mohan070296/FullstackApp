package com.movieflix.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionPlanDto {
    private Long id;
    private String type;
    private Double price;
    private Integer durationDays;
    private String benefits;
}