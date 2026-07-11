package com.movieflix.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {
    @NotBlank
    @Size(max = 100)
    private String name;
    
    @NotBlank
    @Size(max = 100)
    @Email
    private String email;
    
    @NotBlank
    @Size(max = 20)
    private String mobile;
    
    @NotBlank
    @Size(max = 255)
    private String password;
    
    @NotBlank
    @Size(max = 255)
    private String confirmPassword;
}