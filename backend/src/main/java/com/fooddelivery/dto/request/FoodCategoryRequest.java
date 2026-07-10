package com.fooddelivery.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FoodCategoryRequest {
    @NotBlank
    private String name;
    private String description;
}
