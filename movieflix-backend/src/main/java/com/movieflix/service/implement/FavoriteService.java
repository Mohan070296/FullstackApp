package com.movieflix.service.implement;

import com.movieflix.dto.FavoriteDto;
import com.movieflix.entity.Favorite;
import com.movieflix.entity.Movie;
import com.movieflix.entity.User;
import com.movieflix.repository.FavoriteRepository;
import com.movieflix.repository.MovieRepository;
import com.movieflix.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoriteService {
    
    @Autowired
    private FavoriteRepository favoriteRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MovieRepository movieRepository;
    
    @Transactional(readOnly = true)
    public List<FavoriteDto> getUserFavorites(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return favoriteRepository.findByUser(user).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public FavoriteDto addFavorite(Long userId, Long movieId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        
        if (favoriteRepository.existsByUserAndMovie(user, movie)) {
            throw new RuntimeException("Movie already in favorites");
        }
        
        Favorite favorite = Favorite.builder()
                .user(user)
                .movie(movie)
                .build();
        
        Favorite savedFavorite = favoriteRepository.save(favorite);
        return convertToDto(savedFavorite);
    }
    
    @Transactional
    public void removeFavorite(Long userId, Long movieId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        
        Favorite favorite = favoriteRepository.findByUserAndMovie(user, movie)
                .orElseThrow(() -> new RuntimeException("Favorite not found"));
        
        favoriteRepository.delete(favorite);
    }
    
    private FavoriteDto convertToDto(Favorite favorite) {
        return FavoriteDto.builder()
                .id(favorite.getId())
                .addedAt(favorite.getAddedAt())
                .movie(favorite.getMovie() != null ? convertToDto(favorite.getMovie()) : null)
                .build();
    }
    
    private com.movieflix.dto.MovieDto convertToDto(Movie movie) {
        return com.movieflix.dto.MovieDto.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .description(movie.getDescription())
                .poster(movie.getPoster())
                .rating(movie.getRating())
                .build();
    }
}