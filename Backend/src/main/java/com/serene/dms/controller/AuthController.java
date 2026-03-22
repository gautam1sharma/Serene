package com.serene.dms.controller;

import com.serene.dms.dto.request.LoginRequest;
import com.serene.dms.dto.request.RefreshTokenRequest;
import com.serene.dms.dto.request.RegisterRequest;
import com.serene.dms.dto.response.ApiResponse;
import com.serene.dms.dto.response.AuthResponse;
import com.serene.dms.entity.User;
import com.serene.dms.repository.UserRepository;
import com.serene.dms.service.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Auth endpoints — login, register, refresh, profile")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Registration successful"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = resolveUserId(userDetails);
        authService.logout(userId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Logged out successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse.UserDto>> me(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = resolveUserId(userDetails);
        AuthResponse.UserDto dto = authService.getCurrentUser(userId);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse.UserDto>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {
        Long userId = resolveUserId(userDetails);
        AuthResponse.UserDto dto = authService.updateProfile(
                userId, body.get("firstName"), body.get("lastName"), body.get("phone"), body.get("avatar"));
        return ResponseEntity.ok(ApiResponse.ok(dto, "Profile updated successfully"));
    }

    @PutMapping("/me/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {
        Long userId = resolveUserId(userDetails);
        authService.changePassword(userId, body.get("oldPassword"), body.get("newPassword"));
        return ResponseEntity.ok(ApiResponse.ok(null, "Password changed successfully"));
    }

    private Long resolveUserId(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }
}
