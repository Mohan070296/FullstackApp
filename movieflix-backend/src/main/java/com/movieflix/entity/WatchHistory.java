package com.movieflix.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "watch_history",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = {"user_id", "movie_id"})
       })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WatchHistory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "watched_at")
    private LocalDateTime watchedAt;
    
    @Column(name = "watch_duration")
    private Integer watchDuration; // in seconds
    
    @Column(name = "progress")
    private Double progress; // percentage 0-100
    
    @Column(name = "is_completed")
    @Builder.Default
    private boolean completed = false;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        watchedAt = LocalDateTime.now();
    }
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id")
    private Movie movie;
}