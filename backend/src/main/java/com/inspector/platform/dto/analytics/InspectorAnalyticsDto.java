package com.inspector.platform.dto.analytics;

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
public class InspectorAnalyticsDto {
    private long totalActivities;
    private long inspections;
    private long trainings;
    private long totalReports;
    private long draftReports;
    private long finalReports;
    private double averageScore;
    private Map<String, Long> activitiesByType;
    private Map<String, Long> reportsByStatus;
    private List<TeacherPerformanceDto> teacherPerformance;
}
