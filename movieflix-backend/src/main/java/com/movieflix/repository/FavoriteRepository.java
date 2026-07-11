package com.movieflix.repository;

import com.movieflix.entity.Favorite;
import com.movieflix.entity.Movie;
import com.movieflix.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    Optional<Favorite> findByUserAndMovie(User user, Movie movie);
    List<Favorite> findByUser(User user);
    boolean existsByUserAndMovie(User user, Movie movie);
}