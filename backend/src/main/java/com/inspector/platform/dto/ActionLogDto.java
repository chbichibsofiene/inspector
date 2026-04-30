package com.inspector.platform.dto;

import com.inspector.platform.entity.ActionLog;
import com.inspector.platform.entity.ActionType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ActionLogDto {
    private Long id;
    private UserDto user;
    private ActionType actionType;
    private String entityType;
    private String entityId;
    private String description;
    private String ipAddress;
    private LocalDateTime createdAt;

    public static ActionLogDto from(ActionLog log) {
        if (log == null) return null;
        return ActionLogDto.builder()
                .id(log.getId())
                .user(log.getUser() != null ? UserDto.from(log.getUser()) : null)
                .actionType(log.getActionType())
                .entityType(log.getEntityType())
                .entityId(log.getEntityId())
                .description(log.getDescription())
                .ipAddress(log.getIpAddress())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
