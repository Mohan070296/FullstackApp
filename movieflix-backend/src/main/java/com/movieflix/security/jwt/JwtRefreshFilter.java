package com.movieflix.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtRefreshFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String refreshToken = request.getHeader("Refresh-Token");
        
        if (refreshToken != null && jwtUtil.validateToken(refreshToken)) {
            if (jwtUtil.isRefreshToken(refreshToken)) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication != null) {
                    String newAccessToken = jwtUtil.generateToken(authentication);
                    response.setHeader("Access-Token", newAccessToken);
                }
            }
        }
        
        filterChain.doFilter(request, response);
    }
}