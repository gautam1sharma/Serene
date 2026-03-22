package com.serene.dms.controller;

import com.serene.dms.dto.response.ApiResponse;
import com.serene.dms.entity.Dealership;
import com.serene.dms.exception.ResourceNotFoundException;
import com.serene.dms.repository.DealershipRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dealerships")
@RequiredArgsConstructor
@Tag(name = "Dealerships", description = "Dealership management")
public class DealershipController {

    private final DealershipRepository dealershipRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Dealership>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(dealershipRepository.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Dealership>> getById(@PathVariable Long id) {
        Dealership d = dealershipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dealership not found"));
        return ResponseEntity.ok(ApiResponse.ok(d));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Dealership>> create(@RequestBody Dealership dealership) {
        return ResponseEntity.ok(ApiResponse.ok(dealershipRepository.save(dealership), "Dealership created"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<Dealership>> update(@PathVariable Long id, @RequestBody Dealership updates) {
        Dealership d = dealershipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dealership not found"));
        if (updates.getName() != null) d.setName(updates.getName());
        if (updates.getPhone() != null) d.setPhone(updates.getPhone());
        if (updates.getEmail() != null) d.setEmail(updates.getEmail());
        if (updates.getStreet() != null) d.setStreet(updates.getStreet());
        if (updates.getCity() != null) d.setCity(updates.getCity());
        if (updates.getState() != null) d.setState(updates.getState());
        if (updates.getZipCode() != null) d.setZipCode(updates.getZipCode());
        if (updates.getServices() != null) d.setServices(updates.getServices());
        if (updates.getOpeningHours() != null) d.setOpeningHours(updates.getOpeningHours());
        return ResponseEntity.ok(ApiResponse.ok(dealershipRepository.save(d), "Dealership updated"));
    }
}
