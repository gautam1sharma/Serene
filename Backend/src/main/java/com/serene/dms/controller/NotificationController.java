package com.serene.dms.controller;

import com.serene.dms.dto.response.ApiResponse;
import com.serene.dms.entity.Notification;
import com.serene.dms.entity.User;
import com.serene.dms.repository.UserRepository;
import com.serene.dms.service.NotificationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "User notification management")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> getAll(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "false") boolean unreadOnly) {
        Long userId = resolveUserId(userDetails);
        return ResponseEntity.ok(ApiResponse.ok(notificationService.getByUser(userId, unreadOnly)));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = resolveUserId(userDetails);
        return ResponseEntity.ok(ApiResponse.ok(notificationService.getUnreadCount(userId)));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Notification>> markRead(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(notificationService.markAsRead(id)));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllRead(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = resolveUserId(userDetails);
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(ApiResponse.ok(null, "All notifications marked as read"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        notificationService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Notification deleted"));
    }

    private Long resolveUserId(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return user.getId();
    }
}
