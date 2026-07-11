package com.movieflix.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieDto {
    private Long id;
    private String title;
    private String description;
    private String poster;
    private String banner;
    private String trailerUrl;
    private String movieUrl;
    private String duration;
    private Double rating;
    private LocalDate releaseDate;
    private boolean subscriptionRequired;
    private String language;
    private CategoryDto category;
}