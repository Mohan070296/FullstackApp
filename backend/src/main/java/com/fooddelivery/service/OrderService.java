package com.fooddelivery.service;

import com.fooddelivery.dto.OrderDto;
import com.fooddelivery.dto.PageResponse;
import com.fooddelivery.dto.request.PlaceOrderRequest;
import com.fooddelivery.dto.request.UpdateOrderStatusRequest;
import com.fooddelivery.entity.*;
import com.fooddelivery.exception.BadRequestException;
import com.fooddelivery.exception.ResourceNotFoundException;
import com.fooddelivery.repository.OrderRepository;
import com.fooddelivery.security.SecurityUtils;
import com.fooddelivery.util.Mapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final SecurityUtils securityUtils;

    @Transactional
    public OrderDto placeOrder(PlaceOrderRequest request) {
        User user = securityUtils.getCurrentUser();
        Cart cart = cartService.getOrCreateCart(user);

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        Restaurant restaurant = cart.getItems().get(0).getFoodItem().getRestaurant();
        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cart.getItems()) {
            BigDecimal unitPrice = cartItem.getFoodItem().getPrice();
            OrderItem orderItem = OrderItem.builder()
                    .foodItem(cartItem.getFoodItem())
                    .quantity(cartItem.getQuantity())
                    .unitPrice(unitPrice)
                    .build();
            orderItems.add(orderItem);
            total = total.add(unitPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        Order order = Order.builder()
                .user(user)
                .restaurant(restaurant)
                .status(OrderStatus.PENDING)
                .totalAmount(total)
                .deliveryAddress(request.getDeliveryAddress())
                .items(orderItems)
                .build();

        orderItems.forEach(item -> item.setOrder(order));
        Order savedOrder = orderRepository.save(order);
        cartService.clearCart();

        return Mapper.toOrderDto(savedOrder);
    }

    public PageResponse<OrderDto> getUserOrders(int page, int size) {
        User user = securityUtils.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orders = orderRepository.findByUserIdOrderByPlacedAtDesc(user.getId(), pageable);
        return Mapper.toPageResponse(orders, Mapper::toOrderDto);
    }

    public PageResponse<OrderDto> getAllOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return Mapper.toPageResponse(orderRepository.findAll(pageable), Mapper::toOrderDto);
    }

    public OrderDto getById(Long id) {
        return Mapper.toOrderDto(findOrder(id));
    }

    @Transactional
    public OrderDto cancelOrder(Long id) {
        User user = securityUtils.getCurrentUser();
        Order order = findOrder(id);

        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Cannot cancel another user's order");
        }

        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new BadRequestException("Order cannot be cancelled in current status");
        }

        order.setStatus(OrderStatus.CANCELLED);
        return Mapper.toOrderDto(orderRepository.save(order));
    }

    @Transactional
    public OrderDto updateStatus(Long id, UpdateOrderStatusRequest request) {
        Order order = findOrder(id);
        order.setStatus(OrderStatus.valueOf(request.getStatus().toUpperCase()));
        return Mapper.toOrderDto(orderRepository.save(order));
    }

    public Order findOrder(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
    }
}
