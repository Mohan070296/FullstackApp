package com.movieflix.controller;

import com.movieflix.dto.WatchHistoryDto;
import com.movieflix.service.implement.WatchHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
public class WatchHistoryController {
    
    @Autowired
    private WatchHistoryService watchHistoryService;
    
    @GetMapping
    public ResponseEntity<List<WatchHistoryDto>> getUserHistory() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = Long.parseLong(authentication.getName());
        List<WatchHistoryDto> history = watchHistoryService.getUserHistory(userId);
        return ResponseEntity.ok(history);
    }
    
    @GetMapping("/recent")
    public ResponseEntity<List<WatchHistoryDto>> getRecentWatchHistory() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = Long.parseLong(authentication.getName());
        List<WatchHistoryDto> history = watchHistoryService.getRecentWatchHistory(userId, 10);
        return ResponseEntity.ok(history);
    }
    
    @PostMapping("/{movieId}")
    public ResponseEntity<WatchHistoryDto> addToHistory(@PathVariable Long movieId, 
                                                        @RequestParam(required = false) Integer duration,
                                                        @RequestParam(required = false) Double progress) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = Long.parseLong(authentication.getName());
        WatchHistoryDto history = watchHistoryService.addToHistory(userId, movieId, duration, progress);
        return ResponseEntity.ok(history);
    }
}