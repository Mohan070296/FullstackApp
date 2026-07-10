package com.fooddelivery.service;

import com.fooddelivery.dto.PageResponse;
import com.fooddelivery.dto.UserDto;
import com.fooddelivery.dto.request.UpdateUserRoleRequest;
import com.fooddelivery.entity.Role;
import com.fooddelivery.entity.User;
import com.fooddelivery.exception.ResourceNotFoundException;
import com.fooddelivery.repository.UserRepository;
import com.fooddelivery.security.SecurityUtils;
import com.fooddelivery.util.Mapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;

    public UserDto getCurrentUser() {
        return Mapper.toUserDto(securityUtils.getCurrentUser());
    }

    public PageResponse<UserDto> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userRepository.findAll(pageable);
        return Mapper.toPageResponse(users, Mapper::toUserDto);
    }

    @Transactional
    public UserDto updateRole(Long id, UpdateUserRoleRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        user.setRole(Role.valueOf(request.getRole().toUpperCase()));
        return Mapper.toUserDto(userRepository.save(user));
    }
}
