package com.serene.dms.controller;

import com.serene.dms.dto.response.ApiResponse;
import com.serene.dms.dto.response.CarResponse;
import com.serene.dms.dto.response.PaginatedResponse;
import com.serene.dms.entity.Car;
import com.serene.dms.enums.CarCategory;
import com.serene.dms.enums.CarStatus;
import com.serene.dms.exception.BadRequestException;
import com.serene.dms.service.CarService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cars")
@RequiredArgsConstructor
@Tag(name = "Cars", description = "Vehicle inventory management")
public class CarController {

    private final CarService carService;

    @GetMapping
    public ResponseEntity<ApiResponse<PaginatedResponse<CarResponse>>> getCars(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) CarCategory category,
            @RequestParam(required = false) CarStatus status,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Long dealershipId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDir) {

        Page<CarResponse> result = carService.getCarsResponse(page, limit, category, status, minPrice, maxPrice, dealershipId, search, sortBy, sortDir);

        PaginatedResponse<CarResponse> response = PaginatedResponse.<CarResponse>builder()
                .data(result.getContent())
                .total(result.getTotalElements())
                .page(page)
                .limit(limit)
                .totalPages(result.getTotalPages())
                .build();

        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CarResponse>> getCarById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(carService.getCarResponseById(id)));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<CarResponse>>> getFeaturedCars(@RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(ApiResponse.ok(carService.getFeaturedCarsResponse(limit)));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CarCategory>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.ok(Arrays.asList(CarCategory.values())));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<CarResponse>>> searchCars(@RequestParam String q) {
        return ResponseEntity.ok(ApiResponse.ok(carService.searchCarsResponse(q)));
    }

    @GetMapping("/dealership/{dealershipId}")
    @PreAuthorize("hasAnyRole('DEALER','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<List<CarResponse>>> getByDealership(@PathVariable Long dealershipId) {
        return ResponseEntity.ok(ApiResponse.ok(carService.getCarsByDealershipResponse(dealershipId)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DEALER','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<CarResponse>> createCar(@RequestBody Car car) {
        Car saved = carService.createCar(car);
        return ResponseEntity.ok(ApiResponse.ok(carService.toCarResponse(saved), "Car added to inventory successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('DEALER','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<CarResponse>> updateCar(@PathVariable Long id, @RequestBody Car car) {
        Car updated = carService.updateCar(id, car);
        return ResponseEntity.ok(ApiResponse.ok(carService.toCarResponse(updated), "Car updated successfully"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('DEALER','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<CarResponse>> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String raw = body.get("status");
        if (raw == null || raw.isBlank()) {
            throw new BadRequestException("status is required");
        }
        CarStatus status = CarStatus.fromApi(raw);
        if (status == null) {
            throw new BadRequestException("Invalid status");
        }
        Car updated = carService.updateCarStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok(carService.toCarResponse(updated)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('DEALER','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Car removed from inventory"));
    }
}
