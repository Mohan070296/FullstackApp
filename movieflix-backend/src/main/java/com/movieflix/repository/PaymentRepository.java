package com.movieflix.repository;

import com.movieflix.entity.Payment;
import com.movieflix.entity.PaymentStatus;
import com.movieflix.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUser(User user);
    List<Payment> findByPaymentStatus(PaymentStatus status);
    Optional<Payment> findByTransactionId(String transactionId);
}