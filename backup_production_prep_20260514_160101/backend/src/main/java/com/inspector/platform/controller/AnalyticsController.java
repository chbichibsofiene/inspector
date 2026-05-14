package com.inspector.platform.controller;

import com.inspector.platform.dto.ApiResponse;
import com.inspector.platform.dto.analytics.InspectorAnalyticsDto;
import com.inspector.platform.entity.User;
import com.inspector.platform.repository.UserRepository;
import com.inspector.platform.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.inspector.platform.dto.analytics.AdminAnalyticsDto;
import com.inspector.platform.dto.analytics.TrendAnalyticsDto;
import com.inspector.platform.entity.Subject;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final UserRepository userRepository;

    @GetMapping("/api/inspector/analytics/powerbi")
    @PreAuthorize("hasRole('INSPECTOR')")
    public ResponseEntity<ApiResponse<InspectorAnalyticsDto>> powerBiDataset(Authentication authentication) {
        Long inspectorId = extractUserId(authentication);
        return ResponseEntity.ok(ApiResponse.ok("Power BI dataset retrieved successfully", analyticsService.getInspectorAnalytics(inspectorId)));
    }

    @GetMapping("/api/analytics/admin/kpis")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AdminAnalyticsDto>> getAdminKpis(
            @RequestParam(required = false) Subject subject,
            @RequestParam(required = false) Long regionId,
            @RequestParam(required = false) Long delegationId) {
        return ResponseEntity.ok(ApiResponse.ok("Admin analytics retrieved successfully", analyticsService.getAdminAnalytics(subject, regionId, delegationId)));
    }

    @GetMapping("/api/analytics/inspector/kpis")
    @PreAuthorize("hasRole('INSPECTOR')")
    public ResponseEntity<ApiResponse<InspectorAnalyticsDto>> getInspectorKpis(Authentication authentication) {
        Long inspectorId = extractUserId(authentication);
        return ResponseEntity.ok(ApiResponse.ok("Inspector analytics retrieved successfully", analyticsService.getInspectorAnalytics(inspectorId)));
    }

    @GetMapping("/api/analytics/trends")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TrendAnalyticsDto>> getTrends(
            @RequestParam(required = false) Subject subject,
            @RequestParam(required = false) Long regionId,
            @RequestParam(required = false) Long delegationId) {
        return ResponseEntity.ok(ApiResponse.ok("Trends retrieved successfully", analyticsService.getTrends(subject, regionId, delegationId)));
    }

    private Long extractUserId(Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        return user.getId();
    }
}
