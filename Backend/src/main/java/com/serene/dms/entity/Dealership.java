package com.serene.dms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "dealerships", indexes = {
    @Index(name = "idx_dealerships_code", columnList = "code"),
    @Index(name = "idx_dealerships_manager", columnList = "manager_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Dealership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    // Address fields (flattened)
    private String street;
    @Column(length = 100)
    private String city;
    @Column(length = 100)
    private String state;
    @Column(name = "zip_code", length = 20)
    private String zipCode;
    @Column(length = 100)
    @Builder.Default
    private String country = "India";

    @Column(length = 20)
    private String phone;

    private String email;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private User manager;

    @Column(nullable = false)
    @Builder.Default
    private String status = "active";

    @Column(columnDefinition = "JSON")
    private String services;

    @Column(name = "opening_hours", columnDefinition = "JSON")
    private String openingHours;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
