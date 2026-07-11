package com.movieflix.service.implement;

import com.movieflix.dto.WatchHistoryDto;
import com.movieflix.entity.Movie;
import com.movieflix.entity.User;
import com.movieflix.entity.WatchHistory;
import com.movieflix.repository.MovieRepository;
import com.movieflix.repository.UserRepository;
import com.movieflix.repository.WatchHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WatchHistoryService {
    
    @Autowired
    private WatchHistoryRepository watchHistoryRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MovieRepository movieRepository;
    
    @Transactional(readOnly = true)
    public List<WatchHistoryDto> getUserHistory(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return watchHistoryRepository.findByUserOrderByWatchedAtDesc(user).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<WatchHistoryDto> getRecentWatchHistory(Long userId, int limit) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return watchHistoryRepository.findRecentWatchHistory(user, limit).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public WatchHistoryDto addToHistory(Long userId, Long movieId, Integer duration, Double progress) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        
        WatchHistory history = watchHistoryRepository.findByUserAndMovie(user, movie)
                .orElse(WatchHistory.builder()
                        .user(user)
                        .movie(movie)
                        .build());
        
        history.setWatchDuration(duration);
        history.setProgress(progress);
        history.setCompleted(progress != null && progress >= 100);
        
        WatchHistory savedHistory = watchHistoryRepository.save(history);
        return convertToDto(savedHistory);
    }
    
    private WatchHistoryDto convertToDto(WatchHistory history) {
        return WatchHistoryDto.builder()
                .id(history.getId())
                .watchedAt(history.getWatchedAt())
                .watchDuration(history.getWatchDuration())
                .progress(history.getProgress())
                .completed(history.isCompleted())
                .movie(history.getMovie() != null ? convertToDto(history.getMovie()) : null)
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