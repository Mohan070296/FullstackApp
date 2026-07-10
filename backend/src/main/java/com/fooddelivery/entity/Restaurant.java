package com.fooddelivery.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "restaurants", indexes = {
        @Index(name = "idx_restaurant_city", columnList = "city"),
        @Index(name = "idx_restaurant_rating", columnList = "rating")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    private String address;

    private String city;

    private Double latitude;

    private Double longitude;

    private Double rating;

    private String imageUrl;

    @Builder.Default
    private Boolean isActive = true;
}
