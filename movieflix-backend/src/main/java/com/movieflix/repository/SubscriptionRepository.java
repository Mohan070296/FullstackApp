package com.movieflix.repository;

import com.movieflix.entity.Subscription;
import com.movieflix.entity.SubscriptionType;
import com.movieflix.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    Optional<Subscription> findByUser(User user);
    Optional<Subscription> findByUserAndType(User user, SubscriptionType type);
    boolean existsByUser(User user);
}