package com.movieflix.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String mobile;
    private String profilePhoto;
    private String banner;
    private boolean enabled;
    private boolean emailVerified;
    private String lastLogin;
}