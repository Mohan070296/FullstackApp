package com.movieflix.service.implement;

import com.movieflix.dto.*;
import com.movieflix.entity.Role;
import com.movieflix.entity.RoleName;
import com.movieflix.entity.User;
import com.movieflix.repository.RoleRepository;
import com.movieflix.repository.UserRepository;
import com.movieflix.security.jwt.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        if (userRepository.existsByMobile(request.getMobile())) {
            throw new RuntimeException("Mobile number already exists");
        }
        
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }
        
        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseGet(() -> roleRepository.save(Role.builder()
                        .name(RoleName.ROLE_USER)
                        .description("Regular user")
                        .build()));
        
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .mobile(request.getMobile())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Collections.singletonList(userRole))
                .enabled(true)
                .build();
        
        userRepository.save(user);
        
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        String token = jwtUtil.generateToken(authentication);
        String refreshToken = jwtUtil.generateRefreshToken(authentication);
        
        return AuthResponse.builder()
                .userId(user.getId())
                .token(token)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .name(user.getName())
                .profilePhoto(user.getProfilePhoto())
                .role(userRole.getName().toString())
                .build();
    }
    
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        
        user.setLastLogin(java.time.LocalDateTime.now());
        userRepository.save(user);
        
        String token = jwtUtil.generateToken(authentication);
        String refreshToken = jwtUtil.generateRefreshToken(authentication);
        
        Role userRole = user.getRoles().stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("User role not found"));
        
        return AuthResponse.builder()
                .userId(user.getId())
                .token(token)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .name(user.getName())
                .profilePhoto(user.getProfilePhoto())
                .role(userRole.getName().toString())
                .build();
    }
    
    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtUtil.validateToken(refreshToken) || !jwtUtil.isRefreshToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }
        
        Long userId = jwtUtil.getUserIdFromToken(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                user, null, Collections.emptyList());
        
        String newAccessToken = jwtUtil.generateToken(authentication);
        String newRefreshToken = jwtUtil.generateRefreshToken(authentication);
        
        return AuthResponse.builder()
                .userId(user.getId())
                .token(newAccessToken)
                .refreshToken(newRefreshToken)
                .email(user.getEmail())
                .name(user.getName())
                .profilePhoto(user.getProfilePhoto())
                .role(user.getRoles().stream()
                        .findFirst()
                        .map(r -> r.getName().toString())
                        .orElse("ROLE_USER"))
                .build();
    }
    
    public void logout(String refreshToken) {
        // In a real implementation, you would add the token to a blacklist
        // For now, we just invalidate the session
        SecurityContextHolder.clearContext();
    }
}