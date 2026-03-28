package com.serene.dms.controller;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.serene.dms.dto.request.CreateInquiryRequest;
import com.serene.dms.dto.response.ApiResponse;
import com.serene.dms.dto.response.InquiryResponse;
import com.serene.dms.dto.response.PaginatedResponse;
import com.serene.dms.enums.InquiryStatus;
import com.serene.dms.service.InquiryService;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/inquiries")
@RequiredArgsConstructor
@Tag(name = "Inquiries", description = "Customer inquiry management")
public class InquiryController {

    private final InquiryService inquiryService;

    @GetMapping
    @PreAuthorize("hasAnyRole('DEALER','EMPLOYEE','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<PaginatedResponse<InquiryResponse>>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) InquiryStatus status) {
        Page<InquiryResponse> result = inquiryService.getInquiries(page, limit, status);
        PaginatedResponse<InquiryResponse> r = PaginatedResponse.<InquiryResponse>builder()
                .data(result.getContent()).total(result.getTotalElements())
                .page(page).limit(limit).totalPages(result.getTotalPages()).build();
        return ResponseEntity.ok(ApiResponse.ok(r));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InquiryResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(inquiryService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<InquiryResponse>> create(@Valid @RequestBody CreateInquiryRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(inquiryService.create(request), "Inquiry submitted successfully"));
    }

    @PatchMapping("/{id}/respond")
    @PreAuthorize("hasAnyRole('DEALER','EMPLOYEE','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<InquiryResponse>> respond(@PathVariable Long id, @RequestBody Map<String, Long> body) {
        return ResponseEntity.ok(ApiResponse.ok(inquiryService.respond(id, body.get("dealerId")), "Inquiry marked as responded"));
    }

    @PatchMapping("/{id}/close")
    @PreAuthorize("hasAnyRole('DEALER','EMPLOYEE','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<InquiryResponse>> close(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(inquiryService.close(id), "Inquiry closed successfully"));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('DEALER','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<InquiryResponse>> assign(@PathVariable Long id, @RequestBody Map<String, Long> body) {
        return ResponseEntity.ok(ApiResponse.ok(inquiryService.assign(id, body.get("dealerId")), "Inquiry assigned successfully"));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<InquiryResponse>>> getByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(ApiResponse.ok(inquiryService.getByCustomer(customerId)));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('DEALER','EMPLOYEE','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<List<InquiryResponse>>> getPending(@RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(ApiResponse.ok(inquiryService.getPending(limit)));
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('DEALER','EMPLOYEE','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getStatistics() {
        return ResponseEntity.ok(ApiResponse.ok(inquiryService.getStatistics()));
    }
}
