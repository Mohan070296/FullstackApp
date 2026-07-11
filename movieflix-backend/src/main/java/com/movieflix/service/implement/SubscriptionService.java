package com.movieflix.service.implement;

import com.movieflix.dto.SubscriptionDto;
import com.movieflix.dto.SubscriptionPlanDto;
import com.movieflix.entity.Subscription;
import com.movieflix.entity.SubscriptionPlan;
import com.movieflix.entity.SubscriptionType;
import com.movieflix.entity.User;
import com.movieflix.repository.SubscriptionPlanRepository;
import com.movieflix.repository.SubscriptionRepository;
import com.movieflix.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubscriptionService {
    
    @Autowired
    private SubscriptionRepository subscriptionRepository;
    
    @Autowired
    private SubscriptionPlanRepository subscriptionPlanRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Transactional(readOnly = true)
    public List<SubscriptionPlanDto> getAllPlans() {
        return subscriptionPlanRepository.findAll().stream()
                .map(this::convertToPlanDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public SubscriptionPlanDto getPlanByType(String type) {
        SubscriptionType subscriptionType = SubscriptionType.valueOf(type.toUpperCase());
        SubscriptionPlan plan = subscriptionPlanRepository.findByType(subscriptionType)
                .orElseThrow(() -> new RuntimeException("Plan not found"));
        return convertToPlanDto(plan);
    }
    
    @Transactional(readOnly = true)
    public SubscriptionDto getUserSubscription(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Subscription subscription = subscriptionRepository.findByUser(user)
                .orElse(null);
        
        return subscription != null ? convertToDto(subscription) : null;
    }
    
    @Transactional
    public SubscriptionDto subscribe(Long userId, String planType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        SubscriptionType type = SubscriptionType.valueOf(planType.toUpperCase());
        SubscriptionPlan plan = subscriptionPlanRepository.findByType(type)
                .orElseThrow(() -> new RuntimeException("Plan not found"));
        
        // Cancel existing subscription if any
        subscriptionRepository.findByUser(user).ifPresent(sub -> {
            sub.setActive(false);
            subscriptionRepository.save(sub);
        });
        
        Subscription subscription = Subscription.builder()
                .user(user)
                .type(type)
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusDays(plan.getDurationDays()))
                .active(true)
                .build();
        
        Subscription savedSubscription = subscriptionRepository.save(subscription);
        return convertToDto(savedSubscription);
    }
    
    @Transactional
    public void cancelSubscription(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Subscription subscription = subscriptionRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("No active subscription"));
        
        subscription.setActive(false);
        subscriptionRepository.save(subscription);
    }
    
    private SubscriptionDto convertToDto(Subscription subscription) {
        return SubscriptionDto.builder()
                .id(subscription.getId())
                .type(subscription.getType().toString())
                .startDate(subscription.getStartDate())
                .endDate(subscription.getEndDate())
                .active(subscription.isActive())
                .build();
    }
    
    private SubscriptionPlanDto convertToPlanDto(SubscriptionPlan plan) {
        return SubscriptionPlanDto.builder()
                .id(plan.getId())
                .type(plan.getType().toString())
                .price(plan.getPrice())
                .durationDays(plan.getDurationDays())
                .benefits(plan.getBenefits())
                .build();
    }
}