package com.inspector.platform.service;

import com.inspector.platform.dto.dashboard.AdminDashboardDto;
import com.inspector.platform.dto.dashboard.InspectorDashboardDto;
import com.inspector.platform.dto.dashboard.ResponsibleDashboardDto;
import com.inspector.platform.dto.dashboard.TeacherDashboardDto;

public interface DashboardService {

    
    AdminDashboardDto getAdminDashboard();

    
    InspectorDashboardDto getInspectorDashboard(String email);

    
    TeacherDashboardDto getTeacherDashboard(String email);

    
    ResponsibleDashboardDto getResponsibleDashboard(String email);
}

