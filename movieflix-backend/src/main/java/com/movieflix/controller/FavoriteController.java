package com.movieflix.controller;

import com.movieflix.dto.FavoriteDto;
import com.movieflix.service.implement.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {
    
    @Autowired
    private FavoriteService favoriteService;
    
    @GetMapping
    public ResponseEntity<List<FavoriteDto>> getUserFavorites() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = Long.parseLong(authentication.getName());
        List<FavoriteDto> favorites = favoriteService.getUserFavorites(userId);
        return ResponseEntity.ok(favorites);
    }
    
    @PostMapping("/{movieId}")
    public ResponseEntity<FavoriteDto> addFavorite(@PathVariable Long movieId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = Long.parseLong(authentication.getName());
        FavoriteDto favorite = favoriteService.addFavorite(userId, movieId);
        return ResponseEntity.ok(favorite);
    }
    
    @DeleteMapping("/{movieId}")
    public ResponseEntity<Void> removeFavorite(@PathVariable Long movieId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = Long.parseLong(authentication.getName());
        favoriteService.removeFavorite(userId, movieId);
        return ResponseEntity.noContent().build();
    }
}