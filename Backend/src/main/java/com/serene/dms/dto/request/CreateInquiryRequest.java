package com.serene.dms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateInquiryRequest {

    private Long customerId;

    @NotNull
    private Long carId;

    @NotBlank
    private String customerName;

    @NotBlank
    private String customerEmail;

    private String customerPhone;

    @NotBlank
    private String message;
}
