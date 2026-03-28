package com.serene.dms.dto.response;

import com.serene.dms.enums.CarCategory;
import com.serene.dms.enums.CarStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarResponse {
    private String id;
    private String model;
    private Integer year;
    private CarCategory category;
    private BigDecimal price;
    private CarStatus status;
    private String color;
    private String vin;
    private String engine;
    private String transmission;
    private String fuelType;
    private Integer mileage;
    private List<String> features;
    private List<String> images;
    private String description;
    private String dealershipId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
