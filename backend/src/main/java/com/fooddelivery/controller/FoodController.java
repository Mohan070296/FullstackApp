package com.fooddelivery.controller;

import com.fooddelivery.dto.FoodItemDto;
import com.fooddelivery.dto.PageResponse;
import com.fooddelivery.dto.request.FoodItemRequest;
import com.fooddelivery.service.FoodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/foods")
@RequiredArgsConstructor
public class FoodController {

    private final FoodService foodService;

    @GetMapping
    public ResponseEntity<PageResponse<FoodItemDto>> getAll(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Long restaurantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(foodService.getAll(categoryId, minPrice, maxPrice, restaurantId, page, size));
    }

    @GetMapping("/search")
    public ResponseEntity<PageResponse<FoodItemDto>> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(foodService.search(q, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodItemDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(foodService.getById(id));
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<FoodItemDto>> getByRestaurant(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(foodService.getByRestaurantId(restaurantId));
    }

    @PostMapping
    public ResponseEntity<FoodItemDto> create(@Valid @RequestBody FoodItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(foodService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FoodItemDto> update(@PathVariable Long id,
                                              @Valid @RequestBody FoodItemRequest request) {
        return ResponseEntity.ok(foodService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        foodService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
