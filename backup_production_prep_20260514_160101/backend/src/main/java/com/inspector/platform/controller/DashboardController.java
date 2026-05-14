package com.inspector.platform.controller;

import com.inspector.platform.dto.ApiResponse;
import com.inspector.platform.dto.dashboard.AdminDashboardDto;
import com.inspector.platform.dto.dashboard.InspectorDashboardDto;
import com.inspector.platform.dto.dashboard.ResponsibleDashboardDto;
import com.inspector.platform.dto.dashboard.TeacherDashboardDto;
import com.inspector.platform.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AdminDashboardDto>> adminDashboard() {
        AdminDashboardDto data = dashboardService.getAdminDashboard();
        return ResponseEntity.ok(ApiResponse.ok("Admin dashboard", data));
    }

    
    @GetMapping("/inspector")
    @PreAuthorize("hasRole('INSPECTOR')")
    public ResponseEntity<ApiResponse<InspectorDashboardDto>> inspectorDashboard(Authentication auth) {
        InspectorDashboardDto data = dashboardService.getInspectorDashboard(auth.getName());
        return ResponseEntity.ok(ApiResponse.ok("Inspector dashboard", data));
    }

    
    @GetMapping("/teacher")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<TeacherDashboardDto>> teacherDashboard(Authentication auth) {
        TeacherDashboardDto data = dashboardService.getTeacherDashboard(auth.getName());
        return ResponseEntity.ok(ApiResponse.ok("Teacher dashboard", data));
    }

    
    @GetMapping("/responsible")
    @PreAuthorize("hasRole('PEDAGOGICAL_RESPONSIBLE')")
    public ResponseEntity<ApiResponse<ResponsibleDashboardDto>> responsibleDashboard(Authentication auth) {
        ResponsibleDashboardDto data = dashboardService.getResponsibleDashboard(auth.getName());
        return ResponseEntity.ok(ApiResponse.ok("Pedagogical Responsible dashboard", data));
    }
}

