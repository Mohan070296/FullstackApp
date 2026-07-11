package com.movieflix.controller;

import com.movieflix.dto.PaymentDto;
import com.movieflix.service.implement.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    
    @Autowired
    private PaymentService paymentService;
    
    @GetMapping
    public ResponseEntity<List<PaymentDto>> getUserPayments() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = Long.parseLong(authentication.getName());
        List<PaymentDto> payments = paymentService.getUserPayments(userId);
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PaymentDto> getPaymentById(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }
    
    @PostMapping
    public ResponseEntity<PaymentDto> createPayment(@Valid @RequestBody PaymentDto paymentDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = Long.parseLong(authentication.getName());
        PaymentDto payment = paymentService.createPayment(paymentDto, userId);
        return ResponseEntity.ok(payment);
    }
    
    @PutMapping("/{id}/verify")
    public ResponseEntity<PaymentDto> verifyPayment(@PathVariable Long id) {
        PaymentDto payment = paymentService.verifyPayment(id);
        return ResponseEntity.ok(payment);
    }
}