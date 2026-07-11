package com.movieflix.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActorDto {
    private Long id;
    private String name;
    private String photo;
    private String bio;
}