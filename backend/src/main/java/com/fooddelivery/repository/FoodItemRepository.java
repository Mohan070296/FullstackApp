package com.fooddelivery.repository;

import com.fooddelivery.entity.FoodItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {

    Page<FoodItem> findByIsAvailableTrue(Pageable pageable);

    List<FoodItem> findByRestaurantIdAndIsAvailableTrue(Long restaurantId);

    @Query("SELECT f FROM FoodItem f WHERE f.isAvailable = true AND " +
           "(:categoryId IS NULL OR f.category.id = :categoryId) AND " +
           "(:minPrice IS NULL OR f.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR f.price <= :maxPrice) AND " +
           "(:restaurantId IS NULL OR f.restaurant.id = :restaurantId)")
    Page<FoodItem> findWithFilters(@Param("categoryId") Long categoryId,
                                   @Param("minPrice") BigDecimal minPrice,
                                   @Param("maxPrice") BigDecimal maxPrice,
                                   @Param("restaurantId") Long restaurantId,
                                   Pageable pageable);

    @Query("SELECT f FROM FoodItem f WHERE f.isAvailable = true AND " +
           "(LOWER(f.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(f.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<FoodItem> search(@Param("query") String query, Pageable pageable);
}
