package com.movieflix.service.implement;

import com.movieflix.dto.MovieDto;
import com.movieflix.entity.Category;
import com.movieflix.entity.Movie;
import com.movieflix.repository.CategoryRepository;
import com.movieflix.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MovieService {
    
    @Autowired
    private MovieRepository movieRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Transactional(readOnly = true)
    public List<MovieDto> getAllMovies() {
        return movieRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<MovieDto> getMoviesByCategory(Long categoryId) {
        return movieRepository.findByCategoryId(categoryId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<MovieDto> searchMovies(String keyword) {
        return movieRepository.searchByTitle(keyword).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<MovieDto> getTrendingMovies() {
        return movieRepository.findByOrderByRatingDesc().stream()
                .limit(10)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<MovieDto> getLatestMovies() {
        return movieRepository.findByOrderByCreatedAtDesc().stream()
                .limit(10)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<MovieDto> getRecommendedMovies() {
        // Simple recommendation - movies not subscription required
        return movieRepository.findBySubscriptionRequiredFalse().stream()
                .limit(10)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public MovieDto getMovieById(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        return convertToDto(movie);
    }
    
    @Transactional
    public MovieDto createMovie(MovieDto movieDto) {
        Category category = categoryRepository.findById(movieDto.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        Movie movie = Movie.builder()
                .title(movieDto.getTitle())
                .description(movieDto.getDescription())
                .poster(movieDto.getPoster())
                .banner(movieDto.getBanner())
                .trailerUrl(movieDto.getTrailerUrl())
                .movieUrl(movieDto.getMovieUrl())
                .duration(movieDto.getDuration())
                .rating(movieDto.getRating())
                .releaseDate(movieDto.getReleaseDate())
                .subscriptionRequired(movieDto.isSubscriptionRequired())
                .language(movieDto.getLanguage())
                .category(category)
                .build();
        
        Movie savedMovie = movieRepository.save(movie);
        return convertToDto(savedMovie);
    }
    
    @Transactional
    public MovieDto updateMovie(Long id, MovieDto movieDto) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        
        movie.setTitle(movieDto.getTitle());
        movie.setDescription(movieDto.getDescription());
        movie.setPoster(movieDto.getPoster());
        movie.setBanner(movieDto.getBanner());
        movie.setTrailerUrl(movieDto.getTrailerUrl());
        movie.setMovieUrl(movieDto.getMovieUrl());
        movie.setDuration(movieDto.getDuration());
        movie.setRating(movieDto.getRating());
        movie.setReleaseDate(movieDto.getReleaseDate());
        movie.setSubscriptionRequired(movieDto.isSubscriptionRequired());
        movie.setLanguage(movieDto.getLanguage());
        
        if (movieDto.getCategory() != null && movieDto.getCategory().getId() != null) {
            Category category = categoryRepository.findById(movieDto.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            movie.setCategory(category);
        }
        
        Movie updatedMovie = movieRepository.save(movie);
        return convertToDto(updatedMovie);
    }
    
    @Transactional
    public void deleteMovie(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        movieRepository.delete(movie);
    }
    
    private MovieDto convertToDto(Movie movie) {
        return MovieDto.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .description(movie.getDescription())
                .poster(movie.getPoster())
                .banner(movie.getBanner())
                .trailerUrl(movie.getTrailerUrl())
                .movieUrl(movie.getMovieUrl())
                .duration(movie.getDuration())
                .rating(movie.getRating())
                .releaseDate(movie.getReleaseDate())
                .subscriptionRequired(movie.isSubscriptionRequired())
                .language(movie.getLanguage())
                .category(movie.getCategory() != null ? convertToDto(movie.getCategory()) : null)
                .build();
    }
    
    private com.movieflix.dto.CategoryDto convertToDto(Category category) {
        return com.movieflix.dto.CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .icon(category.getIcon())
                .build();
    }
}