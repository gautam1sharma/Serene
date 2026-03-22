package com.serene.dms.service;

import com.serene.dms.entity.Notification;
import com.serene.dms.entity.User;
import com.serene.dms.enums.NotificationType;
import com.serene.dms.exception.ResourceNotFoundException;
import com.serene.dms.repository.NotificationRepository;
import com.serene.dms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public List<Notification> getByUser(Long userId, boolean unreadOnly) {
        if (unreadOnly) return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public Notification markAsRead(Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        n.setIsRead(true);
        return notificationRepository.save(n);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsReadByUserId(userId);
    }

    @Transactional
    public void delete(Long id) {
        notificationRepository.deleteById(id);
    }

    @Transactional
    public Notification create(Long userId, NotificationType type, String title, String message) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Notification n = Notification.builder()
                .user(user).type(type).title(title).message(message).isRead(false).build();
        return notificationRepository.save(n);
    }
}
