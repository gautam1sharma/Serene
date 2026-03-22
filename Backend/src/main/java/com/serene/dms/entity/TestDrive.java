package com.serene.dms.entity;

import com.serene.dms.enums.TestDriveStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "test_drives", indexes = {
    @Index(name = "idx_td_customer", columnList = "customer_id"),
    @Index(name = "idx_td_dealership", columnList = "dealership_id"),
    @Index(name = "idx_td_status", columnList = "status"),
    @Index(name = "idx_td_date", columnList = "preferred_date")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TestDrive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @Column(name = "customer_name", nullable = false, length = 200)
    private String customerName;

    @Column(name = "customer_email", nullable = false)
    private String customerEmail;

    @Column(name = "customer_phone", length = 20)
    private String customerPhone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_id", nullable = false)
    private Car car;

    @Column(name = "car_model", nullable = false)
    private String carModel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dealership_id", nullable = false)
    private Dealership dealership;

    @Column(name = "preferred_date", nullable = false)
    private LocalDate preferredDate;

    @Column(name = "preferred_time", length = 10)
    private String preferredTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TestDriveStatus status = TestDriveStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_dealer_id")
    private User assignedDealer;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    private Integer rating;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
