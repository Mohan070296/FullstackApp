package com.movieflix.controller;

import com.movieflix.dto.ContactMessageDto;
import com.movieflix.service.implement.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/contact")
public class ContactController {
    
    @Autowired
    private ContactService contactService;
    
    @PostMapping
    public ResponseEntity<ContactMessageDto> sendMessage(@Valid @RequestBody ContactMessageDto messageDto) {
        Long userId = null;
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            userId = Long.parseLong(authentication.getName());
        } catch (Exception e) {
            // Guest user
        }
        
        ContactMessageDto message = contactService.sendMessage(userId, messageDto);
        return ResponseEntity.ok(message);
    }
}