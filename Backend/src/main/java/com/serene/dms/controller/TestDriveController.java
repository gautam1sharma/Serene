package com.serene.dms.controller;

import com.serene.dms.dto.response.ApiResponse;
import com.serene.dms.dto.response.PaginatedResponse;
import com.serene.dms.entity.TestDrive;
import com.serene.dms.enums.TestDriveStatus;
import com.serene.dms.service.TestDriveService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/test-drives")
@RequiredArgsConstructor
@Tag(name = "Test Drives", description = "Test drive scheduling & management")
public class TestDriveController {

    private final TestDriveService testDriveService;

    @GetMapping
    public ResponseEntity<ApiResponse<PaginatedResponse<TestDrive>>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) TestDriveStatus status) {
        Page<TestDrive> result = testDriveService.getAll(page, limit, status);
        PaginatedResponse<TestDrive> r = PaginatedResponse.<TestDrive>builder()
                .data(result.getContent()).total(result.getTotalElements())
                .page(page).limit(limit).totalPages(result.getTotalPages()).build();
        return ResponseEntity.ok(ApiResponse.ok(r));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TestDrive>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(testDriveService.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<TestDrive>> schedule(@RequestBody TestDrive td) {
        return ResponseEntity.ok(ApiResponse.ok(testDriveService.schedule(td), "Test drive scheduled successfully"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('DEALER','EMPLOYEE','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<TestDrive>> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        TestDriveStatus s = TestDriveStatus.valueOf(body.get("status").toUpperCase());
        return ResponseEntity.ok(ApiResponse.ok(testDriveService.updateStatus(id, s)));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('DEALER','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<TestDrive>> assign(@PathVariable Long id, @RequestBody Map<String, Long> body) {
        return ResponseEntity.ok(ApiResponse.ok(testDriveService.assignDealer(id, body.get("dealerId")), "Dealer assigned successfully"));
    }

    @PatchMapping("/{id}/feedback")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<TestDrive>> feedback(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        String fb = (String) body.get("feedback");
        Integer rating = (Integer) body.get("rating");
        return ResponseEntity.ok(ApiResponse.ok(testDriveService.addFeedback(id, fb, rating), "Feedback added successfully"));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<TestDrive>> cancel(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null ? body.get("reason") : null;
        return ResponseEntity.ok(ApiResponse.ok(testDriveService.cancel(id, reason), "Test drive cancelled successfully"));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<TestDrive>>> getByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(ApiResponse.ok(testDriveService.getByCustomer(customerId)));
    }

    @GetMapping("/upcoming")
    @PreAuthorize("hasAnyRole('DEALER','EMPLOYEE','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<List<TestDrive>>> getUpcoming(@RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(ApiResponse.ok(testDriveService.getUpcoming(limit)));
    }
}
