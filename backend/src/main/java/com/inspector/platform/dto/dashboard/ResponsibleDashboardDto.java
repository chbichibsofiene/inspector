package com.inspector.platform.dto.dashboard;

import com.inspector.platform.dto.UserDto;
import com.inspector.platform.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponsibleDashboardDto {

    private Long userId;
    private String email;
    private String serialCode;
    private Role role;
    private LocalDateTime memberSince;
    private LocalDateTime verifiedAt;

    
    private long totalTeachers;

    
    private long totalInspectors;

    private String status;
    private String message;

    
    private List<UserDto> teachers;

    
    private List<UserDto> inspectors;
}

