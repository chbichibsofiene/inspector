package com.inspector.platform.controller;

import com.inspector.platform.dto.*;
import com.inspector.platform.dto.analytics.AdminAnalyticsDto;
import com.inspector.platform.dto.analytics.TrendAnalyticsDto;
import com.inspector.platform.entity.*;
import com.inspector.platform.service.AdminService;
import com.inspector.platform.service.AuditService;
import com.inspector.platform.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final AuditService auditService;
    private final AnalyticsService analyticsService;

    // --- User Management ---
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.ok("All users retrieved", adminService.getAllUsers()));
    }









    // --- Audit & Logs ---
    @GetMapping("/logs")
    public ResponseEntity<ApiResponse<List<ActionLogDto>>> getLogs(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) ActionType actionType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<ActionLogDto> logs = auditService.getLogs(userId, actionType, startDate, endDate)
                .stream().map(ActionLogDto::from).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok("Action logs retrieved", logs));
    }

    @GetMapping("/users/{id}/history")
    public ResponseEntity<ApiResponse<List<ActionLogDto>>> getUserHistory(@PathVariable String id) {
        List<ActionLogDto> history = auditService.getUserHistory(id)
                .stream().map(ActionLogDto::from).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok("User history retrieved", history));
    }

    // --- Locations (The ones for filters) ---
    @GetMapping("/regions")
    public ResponseEntity<ApiResponse<List<com.inspector.platform.dto.RegionDto>>> getRegions() {
        return ResponseEntity.ok(ApiResponse.ok("Regions retrieved from DB", adminService.getRegions()));
    }

    @GetMapping("/delegations")
    public ResponseEntity<ApiResponse<List<com.inspector.platform.dto.DelegationDto>>> getDelegations(
            @RequestParam(required = false) Long regionId) {
        if (regionId != null) {
            return ResponseEntity.ok(ApiResponse.ok("Delegations retrieved for region", adminService.getDelegationsByRegion(regionId)));
        }
        return ResponseEntity.ok(ApiResponse.ok("All delegations retrieved from DB", adminService.getAllDelegations()));
    }

    // --- Analytics Distributions ---
    @GetMapping("/analytics/regions")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getRegionAnalytics(@RequestParam(required = false) Subject subject) {
        return ResponseEntity.ok(ApiResponse.ok("Region analytics retrieved", auditService.getRegionAnalytics(subject)));
    }

    @GetMapping("/analytics/delegations")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getDelegationAnalytics(@RequestParam(required = false) Subject subject) {
        return ResponseEntity.ok(ApiResponse.ok("Delegation analytics retrieved", auditService.getDelegationAnalytics(subject)));
    }

    @GetMapping("/analytics/users")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getUserAnalytics() {
        return ResponseEntity.ok(ApiResponse.ok("User analytics retrieved", auditService.getUserAnalytics()));
    }

    // --- Dashboard & Alerts ---
    @GetMapping("/dashboard/kpis")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardKpis() {
        return ResponseEntity.ok(ApiResponse.ok("Dashboard KPIs retrieved", auditService.getDashboardKpis()));
    }

    @GetMapping("/alerts")
    public ResponseEntity<ApiResponse<List<String>>> getAlerts() {
        return ResponseEntity.ok(ApiResponse.ok("Alerts retrieved", auditService.detectSuspiciousActivity()));
    }

    // --- Main Analytics ---
    @GetMapping("/analytics/kpis")
    public ResponseEntity<ApiResponse<AdminAnalyticsDto>> getAdminKpis(
            @RequestParam(required = false) Subject subject,
            @RequestParam(required = false) Long regionId,
            @RequestParam(required = false) Long delegationId) {
        return ResponseEntity.ok(ApiResponse.ok("Admin KPIs retrieved", analyticsService.getAdminAnalytics(subject, regionId, delegationId)));
    }

    @GetMapping("/analytics/trends")
    public ResponseEntity<ApiResponse<TrendAnalyticsDto>> getTrends(
            @RequestParam(required = false) Subject subject,
            @RequestParam(required = false) Long regionId,
            @RequestParam(required = false) Long delegationId) {
        return ResponseEntity.ok(ApiResponse.ok("Trends retrieved", analyticsService.getTrends(subject, regionId, delegationId)));
    }
}
