package com.inspector.platform.service.impl;

import com.inspector.platform.dto.NotificationDto;
import com.inspector.platform.entity.Notification;
import com.inspector.platform.entity.Role;
import com.inspector.platform.entity.User;
import com.inspector.platform.repository.InspectorProfileRepository;
import com.inspector.platform.repository.NotificationRepository;
import com.inspector.platform.repository.TeacherProfileRepository;
import com.inspector.platform.repository.UserRepository;
import com.inspector.platform.service.NotificationService;
import com.inspector.platform.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final InspectorProfileRepository inspectorProfileRepository;
    private final TeacherProfileRepository teacherProfileRepository;

    @Override
    @Transactional
    public void sendNotification(Long recipientId, String title, String message, String type, String targetUrl) {
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new IllegalArgumentException("Recipient not found"));

        Notification notification = Notification.builder()
                .recipient(recipient)
                .title(title)
                .message(message)
                .type(type)
                .targetUrl(targetUrl)
                .isRead(false)
                .build();

        notificationRepository.save(notification);
        log.info("Sent notification to user {}: {}", recipientId, title);

        // Also send an email notification based on type
        try {
            String fullName = getFullName(recipient);
            if ("ACCOUNT_VERIFIED".equals(type)) {
                emailService.sendAccountVerificationEmail(recipient.getEmail(), fullName);
            } else if ("REGISTRATION_SUCCESS".equals(type)) {
                emailService.sendRegistrationEmail(recipient.getEmail(), fullName);
            } else {
                emailService.sendGenericNotificationEmail(recipient.getEmail(), fullName, title, message, targetUrl);
            }
        } catch (Exception e) {
            log.error("Failed to send email for notification type {}: {}", type, e.getMessage());
        }
    }

    private String getFullName(User user) {
        if (user.getRole() == Role.INSPECTOR) {
            return inspectorProfileRepository.findByUserId(user.getId())
                    .map(p -> p.getFirstName() + " " + p.getLastName())
                    .orElse(user.getEmail());
        } else if (user.getRole() == Role.TEACHER) {
            return teacherProfileRepository.findByUserId(user.getId())
                    .map(p -> p.getFirstName() + " " + p.getLastName())
                    .orElse(user.getEmail());
        }
        return user.getEmail();
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationDto> getUserNotifications(Long userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(userId);
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found"));

        if (!notification.getRecipient().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to modify this notification");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    private NotificationDto mapToDto(Notification notif) {
        return NotificationDto.builder()
                .id(notif.getId())
                .title(notif.getTitle())
                .message(notif.getMessage())
                .type(notif.getType())
                .targetUrl(notif.getTargetUrl())
                .isRead(notif.isRead())
                .createdAt(notif.getCreatedAt())
                .build();
    }
}
