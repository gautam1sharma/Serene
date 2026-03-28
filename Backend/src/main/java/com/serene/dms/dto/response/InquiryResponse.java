package com.serene.dms.dto.response;

import com.serene.dms.enums.InquiryStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InquiryResponse {
    private String id;
    private String customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String carId;
    private String carModel;
    private String message;
    private InquiryStatus status;
    private String assignedDealerId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
