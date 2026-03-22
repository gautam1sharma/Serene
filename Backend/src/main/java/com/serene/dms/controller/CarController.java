package com.serene.dms.controller;

import com.serene.dms.dto.response.ApiResponse;
import com.serene.dms.dto.response.PaginatedResponse;
import com.serene.dms.entity.Car;
import com.serene.dms.enums.CarCategory;
import com.serene.dms.enums.CarStatus;
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
    public ResponseEntity<ApiResponse<PaginatedResponse<Car>>> getCars(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) CarCategory category,
            @RequestParam(required = false) CarStatus status,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Long dealershipId,
            @RequestParam(required = false) String search) {

        Page<Car> result = carService.getCars(page, limit, category, status, minPrice, maxPrice, dealershipId, search);

        PaginatedResponse<Car> response = PaginatedResponse.<Car>builder()
                .data(result.getContent())
                .total(result.getTotalElements())
                .page(page)
                .limit(limit)
                .totalPages(result.getTotalPages())
                .build();

        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Car>> getCarById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(carService.getCarById(id)));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<Car>>> getFeaturedCars(@RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(ApiResponse.ok(carService.getFeaturedCars(limit)));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CarCategory>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.ok(Arrays.asList(CarCategory.values())));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Car>>> searchCars(@RequestParam String q) {
        return ResponseEntity.ok(ApiResponse.ok(carService.searchCars(q)));
    }

    @GetMapping("/dealership/{dealershipId}")
    @PreAuthorize("hasAnyRole('DEALER','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<List<Car>>> getByDealership(@PathVariable Long dealershipId) {
        return ResponseEntity.ok(ApiResponse.ok(carService.getCarsByDealership(dealershipId)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DEALER','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<Car>> createCar(@RequestBody Car car) {
        return ResponseEntity.ok(ApiResponse.ok(carService.createCar(car), "Car added to inventory successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('DEALER','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<Car>> updateCar(@PathVariable Long id, @RequestBody Car car) {
        return ResponseEntity.ok(ApiResponse.ok(carService.updateCar(id, car), "Car updated successfully"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('DEALER','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<Car>> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        CarStatus status = CarStatus.valueOf(body.get("status").toUpperCase());
        return ResponseEntity.ok(ApiResponse.ok(carService.updateCarStatus(id, status)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('DEALER','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Car removed from inventory"));
    }
}
