package com.inspector.platform.dto.dashboard;

import com.inspector.platform.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDto {

    private long totalUsers;
    private Map<String, Long> usersByRole;
}
