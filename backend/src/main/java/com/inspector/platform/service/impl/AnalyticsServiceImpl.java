package com.inspector.platform.service.impl;

import com.inspector.platform.dto.analytics.InspectorAnalyticsDto;
import com.inspector.platform.dto.analytics.TeacherPerformanceDto;
import com.inspector.platform.entity.Activity;
import com.inspector.platform.entity.ActivityReport;
import com.inspector.platform.entity.ActivityType;
import com.inspector.platform.entity.ReportStatus;
import com.inspector.platform.entity.TeacherProfile;
import com.inspector.platform.repository.ActivityReportRepository;
import com.inspector.platform.repository.ActivityRepository;
import com.inspector.platform.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final ActivityRepository activityRepository;
    private final ActivityReportRepository reportRepository;

    @Override
    @Transactional(readOnly = true)
    public InspectorAnalyticsDto getInspectorAnalytics(Long inspectorId) {
        List<Activity> activities = activityRepository.findByInspectorIdOrderByStartDateTimeAsc(inspectorId);
        List<ActivityReport> reports = reportRepository.findByInspectorIdOrderByUpdatedAtDesc(inspectorId);

        Map<String, Long> activitiesByType = activities.stream()
                .collect(Collectors.groupingBy(activity -> activity.getType().name(), Collectors.counting()));

        Map<String, Long> reportsByStatus = reports.stream()
                .collect(Collectors.groupingBy(report -> report.getStatus().name(), Collectors.counting()));

        double averageScore = reports.stream()
                .filter(report -> report.getScore() != null)
                .mapToInt(ActivityReport::getScore)
                .average()
                .orElse(0);

        List<TeacherPerformanceDto> teacherPerformance = reports.stream()
                .filter(report -> report.getTeacher() != null && report.getScore() != null)
                .collect(Collectors.groupingBy(ActivityReport::getTeacher))
                .entrySet()
                .stream()
                .map(entry -> mapTeacherPerformance(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparing(TeacherPerformanceDto::getAverageScore).reversed())
                .collect(Collectors.toList());

        return InspectorAnalyticsDto.builder()
                .totalActivities(activities.size())
                .inspections(countActivities(activities, ActivityType.INSPECTION))
                .trainings(countActivities(activities, ActivityType.FORMATION))
                .totalReports(reports.size())
                .draftReports(countReports(reports, ReportStatus.DRAFT))
                .finalReports(countReports(reports, ReportStatus.FINAL))
                .averageScore(roundOneDecimal(averageScore))
                .activitiesByType(activitiesByType)
                .reportsByStatus(reportsByStatus)
                .teacherPerformance(teacherPerformance)
                .build();
    }

    private long countActivities(List<Activity> activities, ActivityType type) {
        return activities.stream()
                .filter(activity -> activity.getType() == type)
                .count();
    }

    private long countReports(List<ActivityReport> reports, ReportStatus status) {
        return reports.stream()
                .filter(report -> report.getStatus() == status)
                .count();
    }

    private TeacherPerformanceDto mapTeacherPerformance(TeacherProfile teacher, List<ActivityReport> reports) {
        double averageScore = reports.stream()
                .mapToInt(ActivityReport::getScore)
                .average()
                .orElse(0);

        return TeacherPerformanceDto.builder()
                .teacherId(teacher.getId())
                .teacherName(teacher.getFirstName() + " " + teacher.getLastName())
                .reportCount(reports.size())
                .averageScore(roundOneDecimal(averageScore))
                .build();
    }

    private double roundOneDecimal(double value) {
        return Math.round(value * 10.0) / 10.0;
    }
}
