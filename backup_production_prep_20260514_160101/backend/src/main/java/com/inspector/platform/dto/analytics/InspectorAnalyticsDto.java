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
    private Map<String, Map<String, Long>> activitiesOverTimeWeekly;
    private Map<String, Map<String, Long>> activitiesOverTimeMonthly;
    private Map<String, Map<String, Long>> activitiesOverTimeYearly;
    private Map<String, Long> activitiesByEtablissement;
    private Map<String, Long> teachersByEtablissement;
    private Map<String, Double> averageScoresOverTime;
}
