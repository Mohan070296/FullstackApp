package com.movieflix.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "movies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Movie {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 255)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Size(max = 500)
    private String poster;
    
    @Size(max = 500)
    private String banner;
    
    @Size(max = 500)
    private String trailerUrl;
    
    @Size(max = 500)
    private String movieUrl;
    
    @Size(max = 50)
    private String duration;
    
    @Column(columnDefinition = "DECIMAL(3,1)")
    private Double rating;
    
    @Column(name = "release_date")
    private LocalDate releaseDate;
    
    @Column(name = "subscription_required")
    @Builder.Default
    private boolean subscriptionRequired = false;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;
    
    @ManyToMany
    @JoinTable(name = "movie_cast",
               joinColumns = @JoinColumn(name = "movie_id"),
               inverseJoinColumns = @JoinColumn(name = "actor_id"))
    private List<Actor> cast = new ArrayList<>();
    
    @Column(name = "language", nullable = false)
    private String language;
    
    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;
    
    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WatchHistory> watchHistory;
    
    @ManyToMany
    @JoinTable(name = "movie_banner",
               joinColumns = @JoinColumn(name = "movie_id"),
               inverseJoinColumns = @JoinColumn(name = "banner_id"))
    private List<Banner> banners;
}