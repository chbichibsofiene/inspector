package com.inspector.platform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationDto {
    private Long id;
    private Long otherUserId;
    private String otherUserName;
    private String otherUserRole;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
    private long unreadCount;
}
