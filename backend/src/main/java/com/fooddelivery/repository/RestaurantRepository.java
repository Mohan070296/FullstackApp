package com.fooddelivery.repository;

import com.fooddelivery.entity.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    Page<Restaurant> findByIsActiveTrue(Pageable pageable);

    @Query("SELECT r FROM Restaurant r WHERE r.isActive = true AND " +
           "(:city IS NULL OR LOWER(r.city) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
           "(:minRating IS NULL OR r.rating >= :minRating)")
    Page<Restaurant> findWithFilters(@Param("city") String city,
                                     @Param("minRating") Double minRating,
                                     Pageable pageable);

    @Query("SELECT r FROM Restaurant r WHERE r.isActive = true AND " +
           "(LOWER(r.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.city) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Restaurant> search(@Param("query") String query, Pageable pageable);
}
