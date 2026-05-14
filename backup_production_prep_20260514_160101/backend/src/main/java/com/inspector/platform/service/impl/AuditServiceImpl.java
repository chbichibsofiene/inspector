package com.inspector.platform.service.impl;

import com.inspector.platform.dto.UserDto;
import com.inspector.platform.entity.ActionLog;
import com.inspector.platform.entity.ActionType;
import com.inspector.platform.entity.Personnel;
import com.inspector.platform.repository.ActionLogRepository;
import com.inspector.platform.repository.ActivityReportRepository;
import com.inspector.platform.repository.InspectionRepository;
import com.inspector.platform.repository.PersonnelRepository;
import com.inspector.platform.repository.UserRepository;
import com.inspector.platform.service.AuditService;
import com.inspector.platform.repository.InspectorProfileRepository;
import com.inspector.platform.repository.TeacherProfileRepository;
import com.inspector.platform.entity.Subject;
import com.inspector.platform.entity.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuditServiceImpl implements AuditService {

    private final ActionLogRepository actionLogRepository;
    private final ActivityReportRepository reportRepository;
    private final UserRepository userRepository;
    private final PersonnelRepository personnelRepository;
    private final InspectionRepository inspectionRepository;
    private final TeacherProfileRepository teacherProfileRepository;
    private final InspectorProfileRepository inspectorProfileRepository;

    @Override
    public List<ActionLog> getLogs(Long userId, ActionType actionType, LocalDateTime startDate, LocalDateTime endDate) {
        return actionLogRepository.filterLogs(userId, actionType, startDate, endDate);
    }

    @Override
    public List<ActionLog> getUserHistory(String identifier) {
        Long userId = null;
        try {
            userId = Long.parseLong(identifier);
        } catch (NumberFormatException e) {
            // Try Email
            userId = userRepository.findByEmail(identifier)
                    .map(com.inspector.platform.entity.User::getId)
                    .orElse(null);
            
            // Try Full Name via Personnel table
            if (userId == null) {
                userId = personnelRepository.findAll().stream()
                        .filter(p -> (p.getFirstName() + " " + p.getLastName()).equalsIgnoreCase(identifier)
                                || p.getFirstName().equalsIgnoreCase(identifier)
                                || p.getLastName().equalsIgnoreCase(identifier))
                        .findFirst()
                        .flatMap(p -> userRepository.findBySerialCode(p.getSerialCode()))
                        .map(com.inspector.platform.entity.User::getId)
                        .orElse(null);
            }
        }

        if (userId == null) {
            return new ArrayList<>();
        }
        return actionLogRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public List<Map<String, Object>> getRegionAnalytics(Subject subject) {
        if (subject != null) {
            return reportRepository.getAvgScorePerRegionBySubject(subject);
        }
        return reportRepository.getAvgScorePerRegion();
    }

    @Override
    public List<Map<String, Object>> getDelegationAnalytics(Subject subject) {
        if (subject != null) {
            return reportRepository.getDelegationRankingBySubject(subject);
        }
        return reportRepository.getDelegationRanking();
    }

    @Override
    public List<Map<String, Object>> getUserAnalytics() {
        return inspectionRepository.getMostActiveInspectors();
    }

    @Override
    public Map<String, Object> getDashboardKpis() {
        Map<String, Object> kpis = new HashMap<>();
        kpis.put("totalInspections", inspectionRepository.count());
        kpis.put("activeInspectors", userRepository.countByRole(com.inspector.platform.entity.Role.INSPECTOR));
        kpis.put("alertsCount", detectSuspiciousActivity().size());
        return kpis;
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream().map(user -> {
            UserDto dto = UserDto.from(user);
            // Enrich with Personnel data (firstName, lastName, cin) via serialCode
            if (user.getSerialCode() != null) {
                Optional<Personnel> personnel = personnelRepository.findBySerialCode(user.getSerialCode());
                personnel.ifPresent(p -> {
                    dto.setFirstName(p.getFirstName());
                    dto.setLastName(p.getLastName());
                    dto.setCin(p.getCin());
                });
            }
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> detectSuspiciousActivity() {
        List<Map<String, Object>> alerts = new ArrayList<>();
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        
        userRepository.findAll().forEach(user -> {
            long deleteCount = actionLogRepository.countRecentActions(user.getId(), ActionType.DELETE, oneHourAgo);
            if (deleteCount > 5) {
                Map<String, Object> alert = new java.util.HashMap<>();
                String name = user.getSerialCode();
                String phone = "No phone provided";
                
                if (user.getRole() == Role.INSPECTOR) {
                    inspectorProfileRepository.findByUserId(user.getId()).ifPresent(p -> {
                        alert.put("userName", p.getFirstName() + " " + p.getLastName());
                        alert.put("userPhone", p.getPhone());
                    });
                } else {
                    teacherProfileRepository.findByUserId(user.getId()).ifPresent(p -> {
                        alert.put("userName", p.getFirstName() + " " + p.getLastName());
                        alert.put("userPhone", p.getPhone());
                    });
                }
                
                alert.put("userId", user.getId());
                alert.put("userEmail", user.getEmail());
                alert.put("actionCount", deleteCount);
                alert.put("message", "User " + alert.getOrDefault("userName", user.getEmail()) + " performed " + deleteCount + " deletes in the last hour.");
                alert.put("type", "MASS_DELETION");
                
                alerts.add(alert);
            }
        });
        
        return alerts;
    }

    @Override
    @Transactional
    public void logAction(Long userId, ActionType actionType, String entityName, Long entityId, String description) {
        logAction(userId, actionType, entityName, entityId, description, null);
    }

    @Override
    @Transactional
    public void logAction(Long userId, ActionType actionType, String entityName, Long entityId, String description, String ipAddress) {
        userRepository.findById(userId).ifPresent(user -> {
            ActionLog log = ActionLog.builder()
                    .user(user)
                    .actionType(actionType)
                    .entityType(entityName)
                    .entityId(entityId != null ? entityId.toString() : null)
                    .description(description)
                    .ipAddress(ipAddress)
                    .createdAt(LocalDateTime.now())
                    .build();
            actionLogRepository.save(log);
        });
    }

    @Override
    @Transactional
    public void resolveAlerts(Long userId) {
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        // We delete the suspicious logs to "clear" the alert for the last hour
        actionLogRepository.deleteByUserIdAndActionTypeAndCreatedAtAfter(userId, ActionType.DELETE, oneHourAgo);
    }
}
