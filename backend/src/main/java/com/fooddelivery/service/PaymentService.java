package com.fooddelivery.service;

import com.fooddelivery.dto.PaymentDto;
import com.fooddelivery.dto.request.GenerateQrRequest;
import com.fooddelivery.entity.*;
import com.fooddelivery.exception.BadRequestException;
import com.fooddelivery.exception.ResourceNotFoundException;
import com.fooddelivery.repository.PaymentRepository;
import com.fooddelivery.security.SecurityUtils;
import com.fooddelivery.util.Mapper;
import com.fooddelivery.util.QrCodeGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderService orderService;
    private final SecurityUtils securityUtils;
    private final QrCodeGenerator qrCodeGenerator;

    @Transactional
    public PaymentDto generateQr(GenerateQrRequest request) {
        User user = securityUtils.getCurrentUser();
        Order order = orderService.findOrder(request.getOrderId());

        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Cannot pay for another user's order");
        }

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new BadRequestException("Cannot pay for cancelled order");
        }

        Payment payment = paymentRepository.findByOrderId(order.getId()).orElse(null);

        if (payment == null) {
            String transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            String qrPayload = "PAY|" + transactionId + "|" + order.getTotalAmount() + "|ORDER-" + order.getId();
            String qrCodeData = qrCodeGenerator.generateQrCodeBase64(qrPayload);

            payment = Payment.builder()
                    .order(order)
                    .amount(order.getTotalAmount())
                    .status(PaymentStatus.PENDING)
                    .qrCodeData(qrCodeData)
                    .transactionId(transactionId)
                    .build();
            order.setPayment(payment);
            payment = paymentRepository.save(payment);
        }

        return Mapper.toPaymentDto(payment);
    }

    public PaymentDto getStatus(Long paymentId) {
        User user = securityUtils.getCurrentUser();
        Payment payment = findPayment(paymentId);

        if (!payment.getOrder().getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Access denied");
        }

        return Mapper.toPaymentDto(payment);
    }

    @Transactional
    public PaymentDto confirmPayment(Long paymentId) {
        User user = securityUtils.getCurrentUser();
        Payment payment = findPayment(paymentId);

        if (!payment.getOrder().getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Access denied");
        }

        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            return Mapper.toPaymentDto(payment);
        }

        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setPaidAt(LocalDateTime.now());

        Order order = payment.getOrder();
        order.setStatus(OrderStatus.CONFIRMED);

        return Mapper.toPaymentDto(paymentRepository.save(payment));
    }

    private Payment findPayment(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + id));
    }
}
