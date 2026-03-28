package com.serene.dms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateTestDriveRequest {

    private Long customerId;

    @NotNull
    private Long carId;

    @NotNull
    private Long dealershipId;

    @NotBlank
    private String customerName;

    @NotBlank
    private String customerEmail;

    private String customerPhone;

    @NotBlank
    private String carModel;

    @NotNull
    private LocalDate preferredDate;

    private String preferredTime;

    private String notes;
}
