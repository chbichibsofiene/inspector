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

        // Send Push Notification if token exists
        if (recipient.getExpoPushToken() != null && !recipient.getExpoPushToken().isEmpty()) {
            sendExpoPushNotification(recipient.getExpoPushToken(), title, message, targetUrl);
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

    @Override
    @Transactional
    public void updatePushToken(Long userId, String token) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        user.setExpoPushToken(token);
        userRepository.save(user);
        log.info("Updated push token for user {}: {}", userId, token);
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

    private void sendExpoPushNotification(String expoToken, String title, String body, String data) {
        try {
            java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
            
            java.util.Map<String, Object> payload = new java.util.HashMap<>();
            payload.put("to", expoToken);
            payload.put("title", title != null ? title : "Notification");
            payload.put("body", body != null ? body : "");
            payload.put("data", java.util.Map.of("targetUrl", data != null ? data : ""));
            payload.put("sound", "default");

            String json = new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(payload);

            java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                .uri(java.net.URI.create("https://exp.host/--/api/v2/push/send"))
                .header("Content-Type", "application/json")
                .POST(java.net.http.HttpRequest.BodyPublishers.ofString(json))
                .build();

            client.sendAsync(request, java.net.http.HttpResponse.BodyHandlers.ofString())
                .thenAccept(response -> {
                    if (response.statusCode() == 200) {
                        log.info("Expo push notification sent successfully to {}", expoToken);
                    } else {
                        log.error("Failed to send Expo push notification. Status: {}, Body: {}", response.statusCode(), response.body());
                    }
                });
        } catch (Exception e) {
            log.error("Error preparing Expo push notification: {}", e.getMessage());
        }
    }
}
