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
public class TeacherDashboardDto {

    private Long userId;
    private String email;
    private String serialCode;
    private Role role;
    private LocalDateTime memberSince;


    private boolean profileCompleted;
    private String firstName;
    private String lastName;
    private String subject;
    private String schoolName;
    private String status;
    private String message;
    
    private String phone;
    private String language;
    private String profileImageUrl;
}

