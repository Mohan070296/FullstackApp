package com.movieflix.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BannerDto {
    private Long id;
    private Integer sortOrder;
    private boolean active;
    private MovieDto movie;
}