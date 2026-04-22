package com.inspector.platform.dto.dashboard;

import com.inspector.platform.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InspectorDashboardDto {

    private Long userId;
    private String email;
    private String serialCode;
    private Role role;
    private LocalDateTime memberSince;
    private LocalDateTime verifiedAt;

    private boolean profileCompleted;
    private String status;
    private String message;
    
    private String phone;
    private String language;
}

