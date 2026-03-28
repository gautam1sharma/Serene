package com.serene.dms.entity;

import com.serene.dms.enums.TestDriveStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
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

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @JsonProperty("customerId")
    public Long extractCustomerId() {
        return customer != null ? customer.getId() : null;
    }

    @Column(name = "customer_name", nullable = false, length = 200)
    private String customerName;

    @Column(name = "customer_email", nullable = false)
    private String customerEmail;

    @Column(name = "customer_phone", length = 20)
    private String customerPhone;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_id", nullable = false)
    private Car car;

    @JsonProperty("carId")
    public Long getCarIdValue() {
        return car != null ? car.getId() : null;
    }

    @Column(name = "car_model", nullable = false)
    private String carModel;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dealership_id", nullable = false)
    private Dealership dealership;

    @JsonProperty("dealershipId")
    public Long getDealershipIdValue() {
        return dealership != null ? dealership.getId() : null;
    }

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

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_dealer_id")
    private User assignedDealer;

    @JsonProperty("assignedDealerId")
    public Long getAssignedDealerIdValue() {
        return assignedDealer != null ? assignedDealer.getId() : null;
    }

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
