package com.inspector.platform.service;

import com.inspector.platform.dto.NotificationDto;

import java.util.List;

public interface NotificationService {
    void sendNotification(Long recipientId, String title, String message, String type, String targetUrl);
    List<NotificationDto> getUserNotifications(Long userId);
    long getUnreadCount(Long userId);
    void markAsRead(Long notificationId, Long userId);
    void markAllAsRead(Long userId);
    void updatePushToken(Long userId, String token);
}
