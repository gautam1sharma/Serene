package com.serene.dms.controller;

import com.serene.dms.dto.response.ApiResponse;
import com.serene.dms.dto.response.PaginatedResponse;
import com.serene.dms.entity.User;
import com.serene.dms.enums.UserStatus;
import com.serene.dms.exception.ResourceNotFoundException;
import com.serene.dms.repository.UserRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Users", description = "Admin user management")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<PaginatedResponse<User>>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        Page<User> result = userRepository.findAll(PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "createdAt")));
        PaginatedResponse<User> r = PaginatedResponse.<User>builder()
                .data(result.getContent()).total(result.getTotalElements())
                .page(page).limit(limit).totalPages(result.getTotalPages()).build();
        return ResponseEntity.ok(ApiResponse.ok(r));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ResponseEntity.ok(ApiResponse.ok(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> update(@PathVariable Long id, @RequestBody User updates) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (updates.getFirstName() != null) user.setFirstName(updates.getFirstName());
        if (updates.getLastName() != null) user.setLastName(updates.getLastName());
        if (updates.getPhone() != null) user.setPhone(updates.getPhone());
        if (updates.getRole() != null) user.setRole(updates.getRole());
        return ResponseEntity.ok(ApiResponse.ok(userRepository.save(user)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<User>> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setStatus(UserStatus.valueOf(body.get("status").toUpperCase()));
        return ResponseEntity.ok(ApiResponse.ok(userRepository.save(user)));
    }
}
