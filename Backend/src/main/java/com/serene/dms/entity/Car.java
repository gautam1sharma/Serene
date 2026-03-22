package com.serene.dms.entity;

import com.serene.dms.enums.CarCategory;
import com.serene.dms.enums.CarStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cars", indexes = {
    @Index(name = "idx_cars_dealership", columnList = "dealership_id"),
    @Index(name = "idx_cars_category", columnList = "category"),
    @Index(name = "idx_cars_status", columnList = "status"),
    @Index(name = "idx_cars_price", columnList = "price")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private Integer year;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CarCategory category;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private CarStatus status = CarStatus.AVAILABLE;

    @Column(length = 50)
    private String color;

    @Column(unique = true, length = 17)
    private String vin;

    @Column(length = 100)
    private String engine;

    @Column(length = 50)
    private String transmission;

    @Column(name = "fuel_type", length = 50)
    private String fuelType;

    @Builder.Default
    private Integer mileage = 0;

    @Column(columnDefinition = "JSON")
    private String features;

    @Column(columnDefinition = "JSON")
    private String images;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dealership_id", nullable = false)
    private Dealership dealership;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
