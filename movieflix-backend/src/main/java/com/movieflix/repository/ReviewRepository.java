package com.movieflix.repository;

import com.movieflix.entity.Movie;
import com.movieflix.entity.Review;
import com.movieflix.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByMovie(Movie movie);
    List<Review> findByUser(User user);
    Optional<Review> findByUserAndMovie(User user, Movie movie);
    boolean existsByUserAndMovie(User user, Movie movie);
}