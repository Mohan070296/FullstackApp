package com.movieflix.service.implement;

import com.movieflix.dto.UserDto;
import com.movieflix.entity.User;
import com.movieflix.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToDto(user);
    }
    
    @Transactional
    public UserDto updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        user.setMobile(userDto.getMobile());
        
        if (userDto.getProfilePhoto() != null) {
            user.setProfilePhoto(userDto.getProfilePhoto());
        }
        
        if (userDto.getBanner() != null) {
            user.setBanner(userDto.getBanner());
        }
        
        User updatedUser = userRepository.save(user);
        return convertToDto(updatedUser);
    }
    
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }
    
    private UserDto convertToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .mobile(user.getMobile())
                .profilePhoto(user.getProfilePhoto())
                .banner(user.getBanner())
                .enabled(user.isEnabled())
                .emailVerified(user.isEmailVerified())
                .lastLogin(user.getLastLogin() != null ? user.getLastLogin().toString() : null)
                .build();
    }
}