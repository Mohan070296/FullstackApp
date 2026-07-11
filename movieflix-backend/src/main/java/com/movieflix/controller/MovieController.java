package com.movieflix.controller;

import com.movieflix.dto.MovieDto;
import com.movieflix.service.implement.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {
    
    @Autowired
    private MovieService movieService;
    
    @GetMapping
    public ResponseEntity<List<MovieDto>> getAllMovies() {
        return ResponseEntity.ok(movieService.getAllMovies());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<MovieDto> getMovieById(@PathVariable Long id) {
        return ResponseEntity.ok(movieService.getMovieById(id));
    }
    
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<MovieDto>> getMoviesByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(movieService.getMoviesByCategory(categoryId));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<MovieDto>> searchMovies(@RequestParam String keyword) {
        return ResponseEntity.ok(movieService.searchMovies(keyword));
    }
    
    @GetMapping("/trending")
    public ResponseEntity<List<MovieDto>> getTrendingMovies() {
        return ResponseEntity.ok(movieService.getTrendingMovies());
    }
    
    @GetMapping("/latest")
    public ResponseEntity<List<MovieDto>> getLatestMovies() {
        return ResponseEntity.ok(movieService.getLatestMovies());
    }
    
    @GetMapping("/recommended")
    public ResponseEntity<List<MovieDto>> getRecommendedMovies() {
        return ResponseEntity.ok(movieService.getRecommendedMovies());
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<MovieDto> createMovie(@Valid @RequestBody MovieDto movieDto) {
        return ResponseEntity.ok(movieService.createMovie(movieDto));
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<MovieDto> updateMovie(@PathVariable Long id, @Valid @RequestBody MovieDto movieDto) {
        return ResponseEntity.ok(movieService.updateMovie(id, movieDto));
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }
}