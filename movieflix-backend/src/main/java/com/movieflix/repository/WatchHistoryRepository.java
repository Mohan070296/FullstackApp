package com.movieflix.repository;

import com.movieflix.entity.Movie;
import com.movieflix.entity.User;
import com.movieflix.entity.WatchHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WatchHistoryRepository extends JpaRepository<WatchHistory, Long> {
    List<WatchHistory> findByUser(User user);
    List<WatchHistory> findByUserOrderByWatchedAtDesc(User user);
    Optional<WatchHistory> findByUserAndMovie(User user, Movie movie);
    
    @Query("SELECT w FROM WatchHistory w WHERE w.user = :user ORDER BY w.watchedAt DESC LIMIT :limit")
    List<WatchHistory> findRecentWatchHistory(@Param("user") User user, @Param("limit") int limit);
}