package com.movieflix.service.implement;

import com.movieflix.dto.ReviewDto;
import com.movieflix.entity.Movie;
import com.movieflix.entity.Review;
import com.movieflix.entity.User;
import com.movieflix.repository.MovieRepository;
import com.movieflix.repository.ReviewRepository;
import com.movieflix.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MovieRepository movieRepository;
    
    @Transactional(readOnly = true)
    public List<ReviewDto> getMovieReviews(Long movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        
        return reviewRepository.findByMovie(movie).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ReviewDto> getUserReviews(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return reviewRepository.findByUser(user).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public ReviewDto addReview(Long userId, Long movieId, ReviewDto reviewDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        
        if (reviewRepository.existsByUserAndMovie(user, movie)) {
            throw new RuntimeException("You have already reviewed this movie");
        }
        
        Review review = Review.builder()
                .user(user)
                .movie(movie)
                .rating(reviewDto.getRating())
                .comment(reviewDto.getComment())
                .build();
        
        Review savedReview = reviewRepository.save(review);
        
        // Update movie rating
        updateMovieRating(movieId);
        
        return convertToDto(savedReview);
    }
    
    @Transactional
    public ReviewDto updateReview(Long userId, Long reviewId, ReviewDto reviewDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only update your own review");
        }
        
        review.setRating(reviewDto.getRating());
        review.setComment(reviewDto.getComment());
        
        Review updatedReview = reviewRepository.save(review);
        return convertToDto(updatedReview);
    }
    
    @Transactional
    public void deleteReview(Long userId, Long reviewId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only delete your own review");
        }
        
        Long movieId = review.getMovie().getId();
        reviewRepository.delete(review);
        
        // Update movie rating
        updateMovieRating(movieId);
    }
    
    private void updateMovieRating(Long movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        
        List<Review> reviews = reviewRepository.findByMovie(movie);
        double averageRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        
        movie.setRating(averageRating);
        movieRepository.save(movie);
    }
    
    private ReviewDto convertToDto(Review review) {
        return ReviewDto.builder()
                .id(review.getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .user(review.getUser() != null ? convertToDto(review.getUser()) : null)
                .movie(review.getMovie() != null ? convertToDto(review.getMovie()) : null)
                .build();
    }
    
    private com.movieflix.dto.UserDto convertToDto(User user) {
        return com.movieflix.dto.UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .profilePhoto(user.getProfilePhoto())
                .build();
    }
    
    private com.movieflix.dto.MovieDto convertToDto(Movie movie) {
        return com.movieflix.dto.MovieDto.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .poster(movie.getPoster())
                .build();
    }
}