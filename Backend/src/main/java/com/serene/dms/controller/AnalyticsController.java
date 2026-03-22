package com.serene.dms.controller;

import com.serene.dms.dto.response.ApiResponse;
import com.serene.dms.service.AnalyticsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Reporting & analytics endpoints")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('DEALER','EMPLOYEE','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> dashboard(
            @RequestParam(required = false) Long dealershipId) {
        return ResponseEntity.ok(ApiResponse.ok(analyticsService.getDashboardMetrics(dealershipId)));
    }

    @GetMapping("/inventory-status")
    @PreAuthorize("hasAnyRole('DEALER','EMPLOYEE','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> inventoryStatus(
            @RequestParam(required = false) Long dealershipId) {
        return ResponseEntity.ok(ApiResponse.ok(analyticsService.getInventoryStatus(dealershipId)));
    }

    @GetMapping("/sales-report")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> salesReport(
            @RequestParam(required = false) String period,
            @RequestParam(required = false) Long dealershipId) {
        return ResponseEntity.ok(ApiResponse.ok(analyticsService.getSalesReport(period, dealershipId)));
    }
}
