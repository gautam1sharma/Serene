package com.serene.dms.dto.response;

import com.serene.dms.enums.UserRole;
import com.serene.dms.enums.UserStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuthResponse {
    private UserDto user;
    private String token;
    private String refreshToken;
    private LocalDateTime expiresAt;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class UserDto {
        private Long id;
        private String email;
        private String firstName;
        private String lastName;
        private UserRole role;
        private UserStatus status;
        private String avatar;
        private String phone;
        private Long dealershipId;
        private LocalDateTime createdAt;
        private LocalDateTime lastLogin;
    }
}
