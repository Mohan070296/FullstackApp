package com.movieflix.controller;

import com.movieflix.dto.SubscriptionDto;
import com.movieflix.dto.SubscriptionPlanDto;
import com.movieflix.service.implement.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {
    
    @Autowired
    private SubscriptionService subscriptionService;
    
    @GetMapping("/plans")
    public ResponseEntity<List<SubscriptionPlanDto>> getAllPlans() {
        return ResponseEntity.ok(subscriptionService.getAllPlans());
    }
    
    @GetMapping("/plans/{type}")
    public ResponseEntity<SubscriptionPlanDto> getPlanByType(@PathVariable String type) {
        return ResponseEntity.ok(subscriptionService.getPlanByType(type));
    }
    
    @GetMapping
    public ResponseEntity<SubscriptionDto> getUserSubscription() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = Long.parseLong(authentication.getName());
        SubscriptionDto subscription = subscriptionService.getUserSubscription(userId);
        return ResponseEntity.ok(subscription);
    }
    
    @PostMapping("/subscribe")
    public ResponseEntity<SubscriptionDto> subscribe(@RequestParam String planType) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = Long.parseLong(authentication.getName());
        SubscriptionDto subscription = subscriptionService.subscribe(userId, planType);
        return ResponseEntity.ok(subscription);
    }
    
    @PostMapping("/cancel")
    public ResponseEntity<Void> cancelSubscription() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = Long.parseLong(authentication.getName());
        subscriptionService.cancelSubscription(userId);
        return ResponseEntity.ok().build();
    }
}