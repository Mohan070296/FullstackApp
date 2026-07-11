package com.movieflix.service.implement;

import com.movieflix.dto.ContactMessageDto;
import com.movieflix.entity.ContactMessage;
import com.movieflix.entity.User;
import com.movieflix.repository.ContactMessageRepository;
import com.movieflix.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContactService {
    
    @Autowired
    private ContactMessageRepository contactMessageRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Transactional(readOnly = true)
    public List<ContactMessageDto> getAllMessages() {
        return contactMessageRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public ContactMessageDto sendMessage(Long userId, ContactMessageDto messageDto) {
        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }
        
        ContactMessage message = ContactMessage.builder()
                .user(user)
                .name(messageDto.getName())
                .email(messageDto.getEmail())
                .subject(messageDto.getSubject())
                .message(messageDto.getMessage())
                .build();
        
        ContactMessage savedMessage = contactMessageRepository.save(message);
        return convertToDto(savedMessage);
    }
    
    private ContactMessageDto convertToDto(ContactMessage message) {
        return ContactMessageDto.builder()
                .id(message.getId())
                .name(message.getName())
                .email(message.getEmail())
                .subject(message.getSubject())
                .message(message.getMessage())
                .createdAt(message.getCreatedAt())
                .build();
    }
}