package com.movieflix.repository;

import com.movieflix.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    
    List<Movie> findByCategoryId(Long categoryId);
    
    List<Movie> findByLanguage(String language);
    
    List<Movie> findByReleaseDateAfter(LocalDate date);
    
    @Query("SELECT m FROM Movie m WHERE LOWER(m.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Movie> searchByTitle(@Param("keyword") String keyword);
    
    @Query("SELECT m FROM Movie m ORDER BY m.rating DESC")
    List<Movie> findByOrderByRatingDesc();
    
    @Query("SELECT m FROM Movie m ORDER BY m.createdAt DESC")
    List<Movie> findByOrderByCreatedAtDesc();
    
    List<Movie> findBySubscriptionRequiredTrue();
    
    List<Movie> findBySubscriptionRequiredFalse();
}