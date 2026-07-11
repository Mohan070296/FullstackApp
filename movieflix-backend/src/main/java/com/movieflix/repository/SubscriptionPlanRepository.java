package com.movieflix.repository;

import com.movieflix.entity.SubscriptionPlan;
import com.movieflix.entity.SubscriptionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlan, Long> {
    Optional<SubscriptionPlan> findByType(SubscriptionType type);
    boolean existsByType(SubscriptionType type);
}