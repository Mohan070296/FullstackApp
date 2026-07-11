package com.movieflix.controller;

import com.movieflix.dto.BannerDto;
import com.movieflix.service.implement.BannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/banners")
public class BannerController {
    
    @Autowired
    private BannerService bannerService;
    
    @GetMapping
    public ResponseEntity<List<BannerDto>> getActiveBanners() {
        return ResponseEntity.ok(bannerService.getActiveBanners());
    }
}