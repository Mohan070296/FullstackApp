package com.movieflix.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDto {
    private Long id;
    private Double amount;
    private String currency;
    private String paymentMethod;
    private String transactionId;
    private String paymentStatus;
    private LocalDateTime paymentDate;
}