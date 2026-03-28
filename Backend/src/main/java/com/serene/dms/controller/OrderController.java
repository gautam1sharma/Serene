package com.serene.dms.controller;

import com.serene.dms.dto.response.ApiResponse;
import com.serene.dms.dto.response.PaginatedResponse;
import com.serene.dms.entity.Order;
import com.serene.dms.exception.BadRequestException;
import com.serene.dms.enums.OrderStatus;
import com.serene.dms.enums.PaymentStatus;
import com.serene.dms.service.OrderService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Sales order management")
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<ApiResponse<PaginatedResponse<Order>>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) OrderStatus status) {
        Page<Order> result = orderService.getOrders(page, limit, status);
        PaginatedResponse<Order> r = PaginatedResponse.<Order>builder()
                .data(result.getContent()).total(result.getTotalElements())
                .page(page).limit(limit).totalPages(result.getTotalPages()).build();
        return ResponseEntity.ok(ApiResponse.ok(r));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Order>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DEALER','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<Order>> create(@RequestBody Order order) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.create(order), "Order created successfully"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('DEALER','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<Order>> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String raw = body.get("status");
        if (raw == null || raw.isBlank()) {
            throw new BadRequestException("status is required");
        }
        OrderStatus s = OrderStatus.fromApi(raw);
        if (s == null) {
            throw new BadRequestException("Invalid status");
        }
        return ResponseEntity.ok(ApiResponse.ok(orderService.updateStatus(id, s)));
    }

    @PatchMapping("/{id}/payment")
    @PreAuthorize("hasAnyRole('DEALER','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<Order>> updatePayment(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String raw = body.get("paymentStatus");
        if (raw == null || raw.isBlank()) {
            throw new BadRequestException("paymentStatus is required");
        }
        PaymentStatus ps = PaymentStatus.fromApi(raw);
        if (ps == null) {
            throw new BadRequestException("Invalid paymentStatus");
        }
        return ResponseEntity.ok(ApiResponse.ok(orderService.updatePaymentStatus(id, ps)));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<Order>>> getByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getByCustomer(customerId)));
    }

    @GetMapping("/recent")
    @PreAuthorize("hasAnyRole('DEALER','EMPLOYEE','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<List<Order>>> getRecent(@RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getRecent(limit)));
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('DEALER','EMPLOYEE','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStatistics(
            @RequestParam(required = false) Long dealershipId) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getStatistics(dealershipId)));
    }
}
