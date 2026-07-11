package com.movieflix.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WatchHistoryDto {
    private Long id;
    private LocalDateTime watchedAt;
    private Integer watchDuration;
    private Double progress;
    private boolean completed;
    private MovieDto movie;
}