package com.fooddelivery.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddCartItemRequest {
    @NotNull
    private Long foodItemId;

    @NotNull
    @Min(1)
    private Integer quantity;
}
