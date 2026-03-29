package com.serene.dms.service;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.serene.dms.dto.request.RegisterRequest;
import com.serene.dms.dto.response.AuthResponse;
import com.serene.dms.entity.RefreshToken;
import com.serene.dms.entity.User;
import com.serene.dms.enums.UserRole;
import com.serene.dms.enums.UserStatus;
import com.serene.dms.exception.BadRequestException;
import com.serene.dms.exception.DuplicateResourceException;
import com.serene.dms.repository.RefreshTokenRepository;
import com.serene.dms.repository.UserRepository;
import com.serene.dms.security.JwtTokenProvider;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    private AuthService authService;

    private User existingUser;

    @BeforeEach
    void setUp() {
        JwtTokenProvider tokenProvider = new JwtTokenProvider(
            "c2VyZW5lLW1vdG9ycy1kbXMtand0LXNlY3JldC1rZXktZm9yLWhtYWMtc2hhMjU2LXNpZ25pbmc=",
            86_400_000L,
            604_800_000L
        );
        authService = new AuthService(
            userRepository,
            refreshTokenRepository,
            tokenProvider,
            passwordEncoder,
            authenticationManager
        );

        existingUser = User.builder()
                .id(1L)
                .email("user@serene.com")
                .passwordHash("hashed-current")
                .firstName("Jane")
                .lastName("Doe")
                .role(UserRole.CUSTOMER)
                .status(UserStatus.ACTIVE)
                .createdAt(LocalDateTime.now().minusDays(1))
                .build();
    }

    @Test
    void register_assignsDefaultRoleAndCreatesRefreshToken() {
        RegisterRequest request = new RegisterRequest(
                "new@serene.com",
                "secret123",
                "New",
                "User",
                "+911234567890",
                null
        );

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(42L);
            user.setCreatedAt(LocalDateTime.now());
            return user;
        });
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AuthResponse response = authService.register(request);

        assertTrue(response.getToken() != null && !response.getToken().isBlank());
        assertTrue(response.getRefreshToken() != null && !response.getRefreshToken().isBlank());
        assertEquals(UserRole.CUSTOMER, response.getUser().getRole());
        assertEquals("new@serene.com", response.getUser().getEmail());

        ArgumentCaptor<User> savedUserCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(savedUserCaptor.capture());
        assertEquals("encoded-password", savedUserCaptor.getValue().getPasswordHash());
        verify(refreshTokenRepository).save(any(RefreshToken.class));
    }

    @Test
    void register_duplicateEmailThrowsConflict() {
        RegisterRequest request = new RegisterRequest(
                "taken@serene.com",
                "secret123",
                "Taken",
                "User",
                "+910000000000",
                UserRole.CUSTOMER
        );

        when(userRepository.existsByEmail("taken@serene.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void refreshToken_expiredTokenDeletesAndThrows() {
        RefreshToken expired = RefreshToken.builder()
                .token("expired-token")
                .user(existingUser)
                .expiresAt(LocalDateTime.now().minusMinutes(1))
                .build();

        when(refreshTokenRepository.findByToken("expired-token")).thenReturn(Optional.of(expired));

        BadRequestException ex = assertThrows(
                BadRequestException.class,
                () -> authService.refreshToken("expired-token")
        );

        assertEquals("Refresh token expired", ex.getMessage());
        verify(refreshTokenRepository).delete(expired);
        verify(refreshTokenRepository, never()).save(any(RefreshToken.class));
    }

    @Test
    void changePassword_rejectsReusedPassword() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches("current-pass", "hashed-current")).thenReturn(true);

        BadRequestException ex = assertThrows(
                BadRequestException.class,
                () -> authService.changePassword(1L, "current-pass", "current-pass")
        );

        assertEquals("New password must be different from current password", ex.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void updateProfile_updatesOnlyProvidedFields() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AuthResponse.UserDto dto = authService.updateProfile(1L, "Janet", null, "+919999999999", null);

        assertEquals("Janet", dto.getFirstName());
        assertEquals("Doe", dto.getLastName());
        assertEquals("+919999999999", dto.getPhone());
        assertTrue(dto.getDealershipId() == null);
    }
}