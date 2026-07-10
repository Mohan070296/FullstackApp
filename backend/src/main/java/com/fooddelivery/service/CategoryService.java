package com.fooddelivery.service;

import com.fooddelivery.dto.FoodCategoryDto;
import com.fooddelivery.dto.request.FoodCategoryRequest;
import com.fooddelivery.entity.FoodCategory;
import com.fooddelivery.exception.ResourceNotFoundException;
import com.fooddelivery.repository.FoodCategoryRepository;
import com.fooddelivery.util.Mapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final FoodCategoryRepository categoryRepository;

    public List<FoodCategoryDto> getAll() {
        return categoryRepository.findAll().stream()
                .map(Mapper::toCategoryDto)
                .collect(Collectors.toList());
    }

    public FoodCategoryDto getById(Long id) {
        return Mapper.toCategoryDto(findCategory(id));
    }

    @Transactional
    public FoodCategoryDto create(FoodCategoryRequest request) {
        FoodCategory category = FoodCategory.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
        return Mapper.toCategoryDto(categoryRepository.save(category));
    }

    @Transactional
    public FoodCategoryDto update(Long id, FoodCategoryRequest request) {
        FoodCategory category = findCategory(id);
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        return Mapper.toCategoryDto(categoryRepository.save(category));
    }

    @Transactional
    public void delete(Long id) {
        categoryRepository.delete(findCategory(id));
    }

    public FoodCategory findCategory(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
    }
}
