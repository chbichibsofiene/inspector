package com.inspector.platform.service;

import com.inspector.platform.entity.ActionLog;
import com.inspector.platform.entity.ActionType;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface AuditService {
    List<ActionLog> getLogs(Long userId, ActionType actionType, LocalDateTime startDate, LocalDateTime endDate);
    List<ActionLog> getUserHistory(String identifier);
    List<Map<String, Object>> getRegionAnalytics(com.inspector.platform.entity.Subject subject);
    List<Map<String, Object>> getDelegationAnalytics(com.inspector.platform.entity.Subject subject);
    List<Map<String, Object>> getUserAnalytics();
    Map<String, Object> getDashboardKpis();
    List<Map<String, Object>> detectSuspiciousActivity();
    void resolveAlerts(Long userId);
    List<com.inspector.platform.dto.UserDto> getAllUsers();
    void logAction(Long userId, ActionType actionType, String entityName, Long entityId, String description);
    void logAction(Long userId, ActionType actionType, String entityName, Long entityId, String description, String ipAddress);
}
