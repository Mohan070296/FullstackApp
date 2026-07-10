package com.fooddelivery.controller;

import com.fooddelivery.dto.PaymentDto;
import com.fooddelivery.dto.request.GenerateQrRequest;
import com.fooddelivery.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/generate-qr")
    public ResponseEntity<PaymentDto> generateQr(@Valid @RequestBody GenerateQrRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentService.generateQr(request));
    }

    @GetMapping("/{id}/status")
    public ResponseEntity<PaymentDto> getStatus(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getStatus(id));
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<PaymentDto> confirmPayment(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.confirmPayment(id));
    }
}
