package com.movieflix;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MovieflixBackendApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(MovieflixBackendApplication.class, args);
        System.out.println("Movie-flix Backend Application is running...");
    }
}