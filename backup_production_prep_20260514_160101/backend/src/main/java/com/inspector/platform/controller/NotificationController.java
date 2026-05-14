package com.inspector.platform.controller;

import com.inspector.platform.dto.ApiResponse;
import com.inspector.platform.dto.NotificationDto;
import com.inspector.platform.entity.User;
import com.inspector.platform.repository.UserRepository;
import com.inspector.platform.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    private Long extractUserId(Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        return user.getId();
    }

    @GetMapping
    public ResponseEntity<?> getUserNotifications(Authentication authentication) {
        Long userId = extractUserId(authentication);
        List<NotificationDto> notifications = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(ApiResponse.ok("Notifications retrieved", notifications));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(Authentication authentication) {
        Long userId = extractUserId(authentication);
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(ApiResponse.ok("Unread count retrieved", Map.of("count", count)));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id, Authentication authentication) {
        Long userId = extractUserId(authentication);
        notificationService.markAsRead(id, userId);
        return ResponseEntity.ok(ApiResponse.ok("Notification marked as read"));
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(Authentication authentication) {
        Long userId = extractUserId(authentication);
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(ApiResponse.ok("All notifications marked as read"));
    }

    @PutMapping("/push-token")
    public ResponseEntity<?> updatePushToken(@RequestBody Map<String, String> request, Authentication authentication) {
        Long userId = extractUserId(authentication);
        String token = request.get("token");
        notificationService.updatePushToken(userId, token);
        return ResponseEntity.ok(ApiResponse.ok("Push token updated successfully"));
    }
}
