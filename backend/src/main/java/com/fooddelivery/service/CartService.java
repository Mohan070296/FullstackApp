package com.fooddelivery.service;

import com.fooddelivery.dto.CartDto;
import com.fooddelivery.dto.request.AddCartItemRequest;
import com.fooddelivery.dto.request.UpdateCartItemRequest;
import com.fooddelivery.entity.*;
import com.fooddelivery.exception.BadRequestException;
import com.fooddelivery.exception.ResourceNotFoundException;
import com.fooddelivery.repository.CartItemRepository;
import com.fooddelivery.repository.CartRepository;
import com.fooddelivery.security.SecurityUtils;
import com.fooddelivery.util.Mapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final FoodService foodService;
    private final SecurityUtils securityUtils;

    public CartDto getCart() {
        User user = securityUtils.getCurrentUser();
        Cart cart = getOrCreateCart(user);
        return Mapper.toCartDto(cart);
    }

    @Transactional
    public CartDto addItem(AddCartItemRequest request) {
        User user = securityUtils.getCurrentUser();
        Cart cart = getOrCreateCart(user);
        FoodItem foodItem = foodService.findFoodItem(request.getFoodItemId());

        if (!foodItem.getIsAvailable()) {
            throw new BadRequestException("Food item is not available");
        }

        if (!cart.getItems().isEmpty()) {
            Long existingRestaurantId = cart.getItems().get(0).getFoodItem().getRestaurant().getId();
            if (!existingRestaurantId.equals(foodItem.getRestaurant().getId())) {
                throw new BadRequestException("Cannot add items from different restaurants. Clear cart first.");
            }
        }

        CartItem cartItem = cartItemRepository.findByCartIdAndFoodItemId(cart.getId(), foodItem.getId())
                .orElse(null);

        if (cartItem != null) {
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
        } else {
            cartItem = CartItem.builder()
                    .cart(cart)
                    .foodItem(foodItem)
                    .quantity(request.getQuantity())
                    .build();
            cart.getItems().add(cartItem);
        }

        cartRepository.save(cart);
        return Mapper.toCartDto(cart);
    }

    @Transactional
    public CartDto updateItem(Long itemId, UpdateCartItemRequest request) {
        User user = securityUtils.getCurrentUser();
        Cart cart = getOrCreateCart(user);
        CartItem cartItem = findCartItem(cart, itemId);
        cartItem.setQuantity(request.getQuantity());
        cartRepository.save(cart);
        return Mapper.toCartDto(cart);
    }

    @Transactional
    public CartDto removeItem(Long itemId) {
        User user = securityUtils.getCurrentUser();
        Cart cart = getOrCreateCart(user);
        CartItem cartItem = findCartItem(cart, itemId);
        cart.getItems().remove(cartItem);
        cartItemRepository.delete(cartItem);
        return Mapper.toCartDto(cart);
    }

    @Transactional
    public void clearCart() {
        User user = securityUtils.getCurrentUser();
        Cart cart = getOrCreateCart(user);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    public Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));
    }

    private CartItem findCartItem(Cart cart, Long itemId) {
        return cart.getItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found: " + itemId));
    }
}
