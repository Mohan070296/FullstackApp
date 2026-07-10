package com.fooddelivery.service;

import com.fooddelivery.dto.FoodItemDto;
import com.fooddelivery.dto.PageResponse;
import com.fooddelivery.dto.request.FoodItemRequest;
import com.fooddelivery.entity.FoodItem;
import com.fooddelivery.exception.ResourceNotFoundException;
import com.fooddelivery.repository.FoodItemRepository;
import com.fooddelivery.util.Mapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FoodService {

    private final FoodItemRepository foodItemRepository;
    private final RestaurantService restaurantService;
    private final CategoryService categoryService;

    public PageResponse<FoodItemDto> getAll(Long categoryId, BigDecimal minPrice, BigDecimal maxPrice,
                                            Long restaurantId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<FoodItem> result = (categoryId != null || minPrice != null || maxPrice != null || restaurantId != null)
                ? foodItemRepository.findWithFilters(categoryId, minPrice, maxPrice, restaurantId, pageable)
                : foodItemRepository.findByIsAvailableTrue(pageable);
        return Mapper.toPageResponse(result, Mapper::toFoodItemDto);
    }

    public PageResponse<FoodItemDto> search(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return Mapper.toPageResponse(foodItemRepository.search(query, pageable), Mapper::toFoodItemDto);
    }

    public FoodItemDto getById(Long id) {
        return Mapper.toFoodItemDto(findFoodItem(id));
    }

    public List<FoodItemDto> getByRestaurantId(Long restaurantId) {
        return foodItemRepository.findByRestaurantIdAndIsAvailableTrue(restaurantId).stream()
                .map(Mapper::toFoodItemDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public FoodItemDto create(FoodItemRequest request) {
        FoodItem foodItem = mapToEntity(new FoodItem(), request);
        return Mapper.toFoodItemDto(foodItemRepository.save(foodItem));
    }

    @Transactional
    public FoodItemDto update(Long id, FoodItemRequest request) {
        FoodItem foodItem = findFoodItem(id);
        mapToEntity(foodItem, request);
        return Mapper.toFoodItemDto(foodItemRepository.save(foodItem));
    }

    @Transactional
    public void delete(Long id) {
        FoodItem foodItem = findFoodItem(id);
        foodItem.setIsAvailable(false);
        foodItemRepository.save(foodItem);
    }

    public FoodItem findFoodItem(Long id) {
        return foodItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found: " + id));
    }

    private FoodItem mapToEntity(FoodItem foodItem, FoodItemRequest request) {
        foodItem.setName(request.getName());
        foodItem.setDescription(request.getDescription());
        foodItem.setPrice(request.getPrice());
        foodItem.setImageUrl(request.getImageUrl());
        if (request.getIsVeg() != null) foodItem.setIsVeg(request.getIsVeg());
        if (request.getIsAvailable() != null) foodItem.setIsAvailable(request.getIsAvailable());
        foodItem.setRestaurant(restaurantService.findRestaurant(request.getRestaurantId()));
        foodItem.setCategory(categoryService.findCategory(request.getCategoryId()));
        return foodItem;
    }
}
