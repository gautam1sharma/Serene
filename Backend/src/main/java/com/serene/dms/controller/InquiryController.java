package com.serene.dms.controller;

import com.serene.dms.dto.response.ApiResponse;
import com.serene.dms.dto.response.PaginatedResponse;
import com.serene.dms.entity.Inquiry;
import com.serene.dms.enums.InquiryStatus;
import com.serene.dms.service.InquiryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/inquiries")
@RequiredArgsConstructor
@Tag(name = "Inquiries", description = "Customer inquiry management")
public class InquiryController {

    private final InquiryService inquiryService;

    @GetMapping
    @PreAuthorize("hasAnyRole('DEALER','EMPLOYEE','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<PaginatedResponse<Inquiry>>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) InquiryStatus status) {
        Page<Inquiry> result = inquiryService.getInquiries(page, limit, status);
        PaginatedResponse<Inquiry> r = PaginatedResponse.<Inquiry>builder()
                .data(result.getContent()).total(result.getTotalElements())
                .page(page).limit(limit).totalPages(result.getTotalPages()).build();
        return ResponseEntity.ok(ApiResponse.ok(r));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Inquiry>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(inquiryService.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<Inquiry>> create(@RequestBody Inquiry inquiry) {
        return ResponseEntity.ok(ApiResponse.ok(inquiryService.create(inquiry), "Inquiry submitted successfully"));
    }

    @PatchMapping("/{id}/respond")
    @PreAuthorize("hasAnyRole('DEALER','EMPLOYEE','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<Inquiry>> respond(@PathVariable Long id, @RequestBody Map<String, Long> body) {
        return ResponseEntity.ok(ApiResponse.ok(inquiryService.respond(id, body.get("dealerId")), "Inquiry marked as responded"));
    }

    @PatchMapping("/{id}/close")
    @PreAuthorize("hasAnyRole('DEALER','EMPLOYEE','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<Inquiry>> close(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(inquiryService.close(id), "Inquiry closed successfully"));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('DEALER','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<Inquiry>> assign(@PathVariable Long id, @RequestBody Map<String, Long> body) {
        return ResponseEntity.ok(ApiResponse.ok(inquiryService.assign(id, body.get("dealerId")), "Inquiry assigned successfully"));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<Inquiry>>> getByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(ApiResponse.ok(inquiryService.getByCustomer(customerId)));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('DEALER','EMPLOYEE','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<List<Inquiry>>> getPending(@RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(ApiResponse.ok(inquiryService.getPending(limit)));
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('DEALER','EMPLOYEE','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getStatistics() {
        return ResponseEntity.ok(ApiResponse.ok(inquiryService.getStatistics()));
    }
}
