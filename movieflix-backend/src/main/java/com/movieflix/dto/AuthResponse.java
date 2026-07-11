package com.movieflix.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private Long userId;
    private String token;
    private String refreshToken;
    private String email;
    private String name;
    private String profilePhoto;
    private String role;
}