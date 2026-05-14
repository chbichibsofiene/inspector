package com.inspector.platform.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "action_logs", indexes = {
    @Index(name = "idx_action_log_user_id", columnList = "user_id"),
    @Index(name = "idx_action_log_type", columnList = "actionType"),
    @Index(name = "idx_action_log_created_at", columnList = "createdAt")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActionType actionType;

    @Column(nullable = false)
    private String entityType;

    @Column
    private String entityId;

    @Column(length = 1000)
    private String description;

    @Column
    private String ipAddress;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
