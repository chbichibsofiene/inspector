package com.inspector.platform.service.impl;

import com.inspector.platform.entity.ActionLog;
import com.inspector.platform.entity.ActionType;
import com.inspector.platform.entity.User;
import com.inspector.platform.repository.ActionLogRepository;
import com.inspector.platform.repository.UserRepository;
import com.inspector.platform.service.LogService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LogServiceImpl implements LogService {

    private final ActionLogRepository actionLogRepository;
    private final UserRepository userRepository;
    private final HttpServletRequest request;

    @Override
    @Transactional
    public void log(User user, ActionType actionType, String entityType, String entityId, String description, String ipAddress) {
        String finalIp = ipAddress;
        if (finalIp == null || finalIp.isEmpty()) {
            finalIp = request.getHeader("X-Forwarded-For");
            if (finalIp == null || finalIp.isEmpty() || "unknown".equalsIgnoreCase(finalIp)) {
                finalIp = request.getRemoteAddr();
            }
            if (finalIp != null && (finalIp.equals("0:0:0:0:0:0:1") || finalIp.contains("0:0:0:0:0:0:1"))) {
                finalIp = "127.0.0.1";
            }
        }

        ActionLog log = ActionLog.builder()
                .user(user)
                .actionType(actionType)
                .entityType(entityType)
                .entityId(entityId)
                .description(description)
                .ipAddress(finalIp)
                .createdAt(LocalDateTime.now())
                .build();
        actionLogRepository.save(log);
    }

    @Override
    @Transactional
    public void log(ActionType actionType, String entityType, String entityId, String description) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElse(null);
        String ipAddress = request.getRemoteAddr();
        
        log(user, actionType, entityType, entityId, description, ipAddress);
    }
}
