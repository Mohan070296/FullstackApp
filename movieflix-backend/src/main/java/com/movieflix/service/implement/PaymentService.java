package com.movieflix.service.implement;

import com.movieflix.dto.PaymentDto;
import com.movieflix.entity.*;
import com.movieflix.repository.PaymentRepository;
import com.movieflix.repository.SubscriptionRepository;
import com.movieflix.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SubscriptionRepository subscriptionRepository;
    
    @Transactional(readOnly = true)
    public List<PaymentDto> getUserPayments(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return paymentRepository.findByUser(user).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public PaymentDto getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        return convertToDto(payment);
    }
    
    @Transactional(readOnly = true)
    public PaymentDto getPaymentByTransactionId(String transactionId) {
        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        return convertToDto(payment);
    }
    
    @Transactional
    public PaymentDto createPayment(PaymentDto paymentDto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Payment payment = Payment.builder()
                .user(user)
                .amount(paymentDto.getAmount())
                .currency(paymentDto.getCurrency())
                .paymentMethod(PaymentMethod.valueOf(paymentDto.getPaymentMethod()))
                .transactionId(paymentDto.getTransactionId())
                .paymentStatus(PaymentStatus.PENDING)
                .build();
        
        Payment savedPayment = paymentRepository.save(payment);
        return convertToDto(savedPayment);
    }
    
    @Transactional
    public PaymentDto verifyPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        
        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        payment.setPaymentDate(LocalDateTime.now());
        
        Payment verifiedPayment = paymentRepository.save(payment);
        
        // Create subscription
        Subscription subscription = Subscription.builder()
                .user(payment.getUser())
                .type(SubscriptionType.PREMIUM)
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusDays(30))
                .active(true)
                .payment(verifiedPayment)
                .build();
        
        subscriptionRepository.save(subscription);
        
        return convertToDto(verifiedPayment);
    }
    
    private PaymentDto convertToDto(Payment payment) {
        return PaymentDto.builder()
                .id(payment.getId())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .paymentMethod(payment.getPaymentMethod().toString())
                .transactionId(payment.getTransactionId())
                .paymentStatus(payment.getPaymentStatus().toString())
                .paymentDate(payment.getPaymentDate())
                .build();
    }
}