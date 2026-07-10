package com.fooddelivery.service;

import com.fooddelivery.dto.PageResponse;
import com.fooddelivery.dto.RestaurantDto;
import com.fooddelivery.dto.request.RestaurantRequest;
import com.fooddelivery.entity.Restaurant;
import com.fooddelivery.exception.ResourceNotFoundException;
import com.fooddelivery.repository.RestaurantRepository;
import com.fooddelivery.util.Mapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    public PageResponse<RestaurantDto> getAll(String city, Double minRating, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "rating"));
        Page<Restaurant> result = (city != null || minRating != null)
                ? restaurantRepository.findWithFilters(city, minRating, pageable)
                : restaurantRepository.findByIsActiveTrue(pageable);
        return Mapper.toPageResponse(result, Mapper::toRestaurantDto);
    }

    public PageResponse<RestaurantDto> search(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return Mapper.toPageResponse(restaurantRepository.search(query, pageable), Mapper::toRestaurantDto);
    }

    public RestaurantDto getById(Long id) {
        return Mapper.toRestaurantDto(findRestaurant(id));
    }

    @Transactional
    public RestaurantDto create(RestaurantRequest request) {
        Restaurant restaurant = mapToEntity(new Restaurant(), request);
        return Mapper.toRestaurantDto(restaurantRepository.save(restaurant));
    }

    @Transactional
    public RestaurantDto update(Long id, RestaurantRequest request) {
        Restaurant restaurant = findRestaurant(id);
        mapToEntity(restaurant, request);
        return Mapper.toRestaurantDto(restaurantRepository.save(restaurant));
    }

    @Transactional
    public void delete(Long id) {
        Restaurant restaurant = findRestaurant(id);
        restaurant.setIsActive(false);
        restaurantRepository.save(restaurant);
    }

    public Restaurant findRestaurant(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found: " + id));
    }

    private Restaurant mapToEntity(Restaurant restaurant, RestaurantRequest request) {
        restaurant.setName(request.getName());
        restaurant.setDescription(request.getDescription());
        restaurant.setAddress(request.getAddress());
        restaurant.setCity(request.getCity());
        restaurant.setLatitude(request.getLatitude());
        restaurant.setLongitude(request.getLongitude());
        restaurant.setRating(request.getRating());
        restaurant.setImageUrl(request.getImageUrl());
        if (request.getIsActive() != null) {
            restaurant.setIsActive(request.getIsActive());
        }
        return restaurant;
    }
}
