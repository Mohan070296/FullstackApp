package com.movieflix.exception;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorResponse {
    private int statusCode;
    private String title;
    private String message;
    private LocalDateTime timestamp;
}