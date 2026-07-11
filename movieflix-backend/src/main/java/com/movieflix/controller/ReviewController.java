package com.movieflix.controller;

import com.movieflix.dto.ReviewDto;
import com.movieflix.service.implement.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    
    @Autowired
    private ReviewService reviewService;
    
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<ReviewDto>> getMovieReviews(@PathVariable Long movieId) {
        List<ReviewDto> reviews = reviewService.getMovieReviews(movieId);
        return ResponseEntity.ok(reviews);
    }
    
    @PostMapping("/{movieId}")
    public ResponseEntity<ReviewDto> addReview(@PathVariable Long movieId, @Valid @RequestBody ReviewDto reviewDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = Long.parseLong(authentication.getName());
        ReviewDto review = reviewService.addReview(userId, movieId, reviewDto);
        return ResponseEntity.ok(review);
    }
    
    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewDto> updateReview(@PathVariable Long reviewId, @Valid @RequestBody ReviewDto reviewDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = Long.parseLong(authentication.getName());
        ReviewDto review = reviewService.updateReview(userId, reviewId, reviewDto);
        return ResponseEntity.ok(review);
    }
    
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = Long.parseLong(authentication.getName());
        reviewService.deleteReview(userId, reviewId);
        return ResponseEntity.noContent().build();
    }
}