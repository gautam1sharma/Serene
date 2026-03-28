package com.serene.dms.controller;

import com.serene.dms.dto.response.ApiResponse;
import com.serene.dms.service.AnalyticsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
    @PreAuthorize("hasAnyRole('DEALER','EMPLOYEE','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> salesReport(
            @RequestParam(required = false) String period,
            @RequestParam(required = false) Long dealershipId) {
        return ResponseEntity.ok(ApiResponse.ok(analyticsService.getSalesReport(period, dealershipId)));
    }

    @GetMapping("/revenue-trends")
    @PreAuthorize("hasAnyRole('DEALER','EMPLOYEE','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> revenueTrends(
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(ApiResponse.ok(analyticsService.getRevenueTrends(days)));
    }

    @GetMapping("/inventory-aging")
    @PreAuthorize("hasAnyRole('DEALER','EMPLOYEE','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> inventoryAging() {
        return ResponseEntity.ok(ApiResponse.ok(analyticsService.getInventoryAging()));
    }

    @GetMapping("/recent-orders")
    @PreAuthorize("hasAnyRole('DEALER','EMPLOYEE','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> recentOrders(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(ApiResponse.ok(analyticsService.getRecentOrders(limit)));
    }
    @GetMapping("/marketing-roi")
    @PreAuthorize("hasAnyRole('DEALER','EMPLOYEE','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Long>>> marketingRoi() {
        return ResponseEntity.ok(ApiResponse.ok(analyticsService.getMarketingROI()));
    }
}
