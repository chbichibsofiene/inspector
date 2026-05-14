package com.inspector.platform.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminAnalyticsDto {
    private long totalInspections;
    private double averageScore;
    private long numberOfTeachers;
    private long numberOfInspectors;
    private List<TeacherPerformanceDto> topPerformingTeachers;
    private List<TeacherPerformanceDto> lowestPerformingTeachers;
    private List<LocationPerformanceDto> topPerformingRegions;
    private List<LocationPerformanceDto> topPerformingDelegations;
}
