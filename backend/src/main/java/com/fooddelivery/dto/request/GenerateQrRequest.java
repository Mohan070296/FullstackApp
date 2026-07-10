package com.fooddelivery.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GenerateQrRequest {
    @NotNull
    private Long orderId;
}
