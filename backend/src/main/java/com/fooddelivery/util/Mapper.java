package com.fooddelivery.util;

import com.fooddelivery.dto.*;
import com.fooddelivery.entity.*;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

public final class Mapper {

    private Mapper() {}

    public static UserDto toUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public static RestaurantDto toRestaurantDto(Restaurant r) {
        return RestaurantDto.builder()
                .id(r.getId())
                .name(r.getName())
                .description(r.getDescription())
                .address(r.getAddress())
                .city(r.getCity())
                .latitude(r.getLatitude())
                .longitude(r.getLongitude())
                .rating(r.getRating())
                .imageUrl(r.getImageUrl())
                .isActive(r.getIsActive())
                .build();
    }

    public static FoodCategoryDto toCategoryDto(FoodCategory c) {
        return FoodCategoryDto.builder()
                .id(c.getId())
                .name(c.getName())
                .description(c.getDescription())
                .build();
    }

    public static FoodItemDto toFoodItemDto(FoodItem f) {
        return FoodItemDto.builder()
                .id(f.getId())
                .name(f.getName())
                .description(f.getDescription())
                .price(f.getPrice())
                .imageUrl(f.getImageUrl())
                .isVeg(f.getIsVeg())
                .isAvailable(f.getIsAvailable())
                .restaurantId(f.getRestaurant().getId())
                .restaurantName(f.getRestaurant().getName())
                .categoryId(f.getCategory().getId())
                .categoryName(f.getCategory().getName())
                .build();
    }

    public static CartItemDto toCartItemDto(CartItem item) {
        BigDecimal subtotal = item.getFoodItem().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
        return CartItemDto.builder()
                .id(item.getId())
                .foodItemId(item.getFoodItem().getId())
                .foodItemName(item.getFoodItem().getName())
                .foodItemImage(item.getFoodItem().getImageUrl())
                .unitPrice(item.getFoodItem().getPrice())
                .quantity(item.getQuantity())
                .subtotal(subtotal)
                .restaurantId(item.getFoodItem().getRestaurant().getId())
                .restaurantName(item.getFoodItem().getRestaurant().getName())
                .build();
    }

    public static CartDto toCartDto(Cart cart) {
        List<CartItemDto> items = cart.getItems().stream()
                .map(Mapper::toCartItemDto)
                .collect(Collectors.toList());

        BigDecimal total = items.stream()
                .map(CartItemDto::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalItems = items.stream().mapToInt(CartItemDto::getQuantity).sum();

        Long restaurantId = items.isEmpty() ? null : items.get(0).getRestaurantId();
        String restaurantName = items.isEmpty() ? null : items.get(0).getRestaurantName();

        return CartDto.builder()
                .id(cart.getId())
                .items(items)
                .totalAmount(total)
                .totalItems(totalItems)
                .restaurantId(restaurantId)
                .restaurantName(restaurantName)
                .build();
    }

    public static OrderItemDto toOrderItemDto(OrderItem item) {
        BigDecimal subtotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
        return OrderItemDto.builder()
                .id(item.getId())
                .foodItemId(item.getFoodItem().getId())
                .foodItemName(item.getFoodItem().getName())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .subtotal(subtotal)
                .build();
    }

    public static PaymentDto toPaymentDto(Payment payment) {
        if (payment == null) return null;
        return PaymentDto.builder()
                .id(payment.getId())
                .orderId(payment.getOrder().getId())
                .amount(payment.getAmount())
                .status(payment.getStatus().name())
                .qrCodeData(payment.getQrCodeData())
                .transactionId(payment.getTransactionId())
                .paidAt(payment.getPaidAt())
                .build();
    }

    public static OrderDto toOrderDto(Order order) {
        List<OrderItemDto> items = order.getItems().stream()
                .map(Mapper::toOrderItemDto)
                .collect(Collectors.toList());

        return OrderDto.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .userName(order.getUser().getName())
                .restaurantId(order.getRestaurant().getId())
                .restaurantName(order.getRestaurant().getName())
                .status(order.getStatus().name())
                .totalAmount(order.getTotalAmount())
                .deliveryAddress(order.getDeliveryAddress())
                .items(items)
                .payment(toPaymentDto(order.getPayment()))
                .placedAt(order.getPlacedAt())
                .build();
    }

    public static <T, R> PageResponse<R> toPageResponse(Page<T> page, java.util.function.Function<T, R> mapper) {
        return PageResponse.<R>builder()
                .content(page.getContent().stream().map(mapper).collect(Collectors.toList()))
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }
}
