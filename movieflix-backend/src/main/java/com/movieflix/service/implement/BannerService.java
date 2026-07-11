package com.movieflix.service.implement;

import com.movieflix.dto.BannerDto;
import com.movieflix.entity.Banner;
import com.movieflix.repository.BannerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BannerService {
    
    @Autowired
    private BannerRepository bannerRepository;
    
    @Transactional(readOnly = true)
    public List<BannerDto> getActiveBanners() {
        return bannerRepository.findByActiveTrueOrderBySortOrder().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    private BannerDto convertToDto(Banner banner) {
        return BannerDto.builder()
                .id(banner.getId())
                .sortOrder(banner.getSortOrder())
                .active(banner.isActive())
                .movie(banner.getMovie() != null ? convertToDto(banner.getMovie()) : null)
                .build();
    }
    
    private com.movieflix.dto.MovieDto convertToDto(com.movieflix.entity.Movie movie) {
        return com.movieflix.dto.MovieDto.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .poster(movie.getPoster())
                .banner(movie.getBanner())
                .build();
    }
}