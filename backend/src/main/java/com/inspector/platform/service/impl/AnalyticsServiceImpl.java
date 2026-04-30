package com.inspector.platform.service.impl;

import com.inspector.platform.dto.analytics.InspectorAnalyticsDto;
import com.inspector.platform.dto.analytics.TeacherPerformanceDto;
import com.inspector.platform.dto.analytics.AdminAnalyticsDto;
import com.inspector.platform.dto.analytics.LocationPerformanceDto;
import com.inspector.platform.dto.analytics.TrendAnalyticsDto;
import com.inspector.platform.entity.Activity;
import com.inspector.platform.entity.ActivityReport;
import com.inspector.platform.entity.ActivityType;
import com.inspector.platform.entity.ReportStatus;
import com.inspector.platform.entity.TeacherProfile;
import com.inspector.platform.entity.InspectorProfile;
import com.inspector.platform.entity.Delegation;
import com.inspector.platform.entity.Dependency;
import com.inspector.platform.entity.Subject;
import com.inspector.platform.repository.ActivityReportRepository;
import com.inspector.platform.repository.ActivityRepository;
import com.inspector.platform.repository.InspectorProfileRepository;
import com.inspector.platform.repository.TeacherProfileRepository;
import com.inspector.platform.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final ActivityRepository activityRepository;
    private final ActivityReportRepository reportRepository;
    private final TeacherProfileRepository teacherProfileRepository;
    private final InspectorProfileRepository inspectorProfileRepository;

    @Override
    @Transactional(readOnly = true)
    public InspectorAnalyticsDto getInspectorAnalytics(Long inspectorId) {
        List<Activity> activities = activityRepository.findByInspectorIdOrderByStartDateTimeAsc(inspectorId);
        List<ActivityReport> reports = reportRepository.findByInspectorIdOrderByUpdatedAtDesc(inspectorId);

        Map<String, Long> activitiesByType = activities.stream()
                .filter(a -> a.getType() != null)
                .collect(Collectors.groupingBy(activity -> activity.getType().name(), Collectors.counting()));

        Map<String, Long> reportsByStatus = reports.stream()
                .filter(r -> r.getStatus() != null)
                .collect(Collectors.groupingBy(report -> report.getStatus().name(), Collectors.counting()));

        double averageScore = reports.stream()
                .filter(report -> report.getScore() != null)
                .mapToInt(ActivityReport::getScore)
                .average()
                .orElse(0);

        List<TeacherPerformanceDto> teacherPerformance = new java.util.ArrayList<>();
        InspectorProfile profile = inspectorProfileRepository.findByUserId(inspectorId).orElse(null);
        
        List<TeacherProfile> assignedTeachers = new java.util.ArrayList<>();
        
        if (profile != null) {
            List<Long> delegationIds = profile.getDelegations().stream().map(Delegation::getId).collect(Collectors.toList());
            List<Long> dependencyIds = profile.getDependencies().stream().map(Dependency::getId).collect(Collectors.toList());

            System.out.println("DEBUG: Analytics for inspectorId: " + inspectorId);
            System.out.println("DEBUG: Activities count: " + activities.size());
            System.out.println("DEBUG: Reports count: " + reports.size());
            
            if (!delegationIds.isEmpty() && !dependencyIds.isEmpty()) {
                assignedTeachers = teacherProfileRepository.findByDelegationIdInAndDependencyIdInAndSubject(
                        delegationIds, dependencyIds, profile.getSubject());
                System.out.println("DEBUG: Assigned teachers count: " + assignedTeachers.size());

                Map<TeacherProfile, List<ActivityReport>> reportsByTeacher = reports.stream()
                        .filter(report -> report.getTeacher() != null && report.getScore() != null)
                        .collect(Collectors.groupingBy(ActivityReport::getTeacher));

                teacherPerformance = assignedTeachers.stream()
                        .map(teacher -> {
                            List<ActivityReport> teacherReports = reportsByTeacher.getOrDefault(teacher, new java.util.ArrayList<>());
                            return mapTeacherPerformance(teacher, teacherReports);
                        })
                        .sorted(Comparator.comparing(TeacherPerformanceDto::getAverageScore).reversed())
                        .collect(Collectors.toList());
            }
        }

        // Helper to fill zeros for a range of dates
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        
        // Weekly (Last 7 Days - Daily breakdown)
        Map<String, Map<String, Long>> activitiesOverTimeWeekly = new java.util.TreeMap<>();
        for (int i = 6; i >= 0; i--) {
            activitiesOverTimeWeekly.put(now.minusDays(i).format(DateTimeFormatter.ofPattern("yyyy-MM-dd")), new java.util.HashMap<>());
        }
        fillActivityCounts(activities, activitiesOverTimeWeekly, "yyyy-MM-dd");

        // Monthly (Last 30 Days - Daily breakdown)
        Map<String, Map<String, Long>> activitiesOverTimeMonthly = new java.util.TreeMap<>();
        for (int i = 29; i >= 0; i--) {
            activitiesOverTimeMonthly.put(now.minusDays(i).format(DateTimeFormatter.ofPattern("yyyy-MM-dd")), new java.util.HashMap<>());
        }
        fillActivityCounts(activities, activitiesOverTimeMonthly, "yyyy-MM-dd");

        // Yearly (Last 3 years - Monthly breakdown for better granularity)
        Map<String, Map<String, Long>> activitiesOverTimeYearly = new java.util.TreeMap<>();
        for (int i = 35; i >= 0; i--) {
            activitiesOverTimeYearly.put(now.minusMonths(i).format(DateTimeFormatter.ofPattern("yyyy-MM")), new java.util.HashMap<>());
        }
        fillActivityCounts(activities, activitiesOverTimeYearly, "yyyy-MM");

        // Impact Analysis: Average Scores over time (Monthly for last 12 months)
        Map<String, Double> averageScoresOverTime = new java.util.TreeMap<>();
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("yyyy-MM");
        for (int i = 11; i >= 0; i--) {
            averageScoresOverTime.put(now.minusMonths(i).format(monthFormatter), 0.0);
        }

        Map<String, List<ActivityReport>> reportsByMonth = reports.stream()
                .filter(r -> r.getActivity() != null && r.getScore() != null)
                .collect(Collectors.groupingBy(r -> r.getActivity().getStartDateTime().format(monthFormatter)));

        reportsByMonth.forEach((month, monthReports) -> {
            if (averageScoresOverTime.containsKey(month)) {
                double avg = monthReports.stream().mapToInt(ActivityReport::getScore).average().orElse(0.0);
                averageScoresOverTime.put(month, roundOneDecimal(avg));
            }
        });

        InspectorAnalyticsDto.InspectorAnalyticsDtoBuilder builder = InspectorAnalyticsDto.builder()
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
                .activitiesOverTimeWeekly(activitiesOverTimeWeekly)
                .activitiesOverTimeMonthly(activitiesOverTimeMonthly)
                .activitiesOverTimeYearly(activitiesOverTimeYearly)
                .averageScoresOverTime(averageScoresOverTime);

        // Activity distribution by Etablissement
        Map<String, Long> activitiesByEtab = activities.stream()
                .collect(Collectors.groupingBy(
                        a -> {
                            if (!a.getGuests().isEmpty() && a.getGuests().get(0).getEtablissement() != null) {
                                return a.getGuests().get(0).getEtablissement().getName();
                            }
                            return (a.getLocation() != null && !a.getLocation().isBlank()) ? a.getLocation() : "Unspecified";
                        },
                        Collectors.counting()
                ));
        builder.activitiesByEtablissement(activitiesByEtab);

        // Teacher distribution by Etablissement
        Map<String, Long> teachersByEtab = assignedTeachers.stream()
                .collect(Collectors.groupingBy(
                        tp -> (tp.getEtablissement() != null) ? tp.getEtablissement().getName() : "Unspecified",
                        Collectors.counting()
                ));
        builder.teachersByEtablissement(teachersByEtab);
        System.out.println("DEBUG: activitiesByEtab keys: " + activitiesByEtab.keySet());
        System.out.println("DEBUG: teachersByEtab keys: " + teachersByEtab.keySet());

        return builder.build();
    }

    private void fillActivityCounts(List<Activity> activities, Map<String, Map<String, Long>> targetMap, String pattern) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
        activities.stream()
                .filter(a -> a.getStartDateTime() != null && a.getType() != null)
                .forEach(a -> {
                    String key = a.getStartDateTime().format(formatter);
                    if (targetMap.containsKey(key)) {
                        Map<String, Long> typeMap = targetMap.get(key);
                        String type = a.getType().name();
                        typeMap.put(type, typeMap.getOrDefault(type, 0L) + 1);
                    }
                });
    }

    private long countActivities(List<Activity> activities, ActivityType type) {
        return activities.stream()
                .filter(activity -> activity.getType() == type)
                .count();
    }

    @Override
    @Transactional(readOnly = true)
    public AdminAnalyticsDto getAdminAnalytics(Subject subject, Long regionId, Long delegationId) {
        List<ActivityReport> allReports = reportRepository.findAll();
        
        // Filter reports
        allReports = allReports.stream()
                .filter(r -> subject == null || (r.getTeacher() != null && r.getTeacher().getSubject() == subject))
                .filter(r -> delegationId == null || (r.getTeacher() != null && r.getTeacher().getDelegation() != null && r.getTeacher().getDelegation().getId().equals(delegationId)))
                .filter(r -> regionId == null || (r.getTeacher() != null && r.getTeacher().getDelegation() != null && r.getTeacher().getDelegation().getRegion() != null && r.getTeacher().getDelegation().getRegion().getId().equals(regionId)))
                .collect(Collectors.toList());
        
        // Filter inspections count
        long totalInspections = activityRepository.findAll().stream()
                .filter(a -> a.getType() == ActivityType.INSPECTION)
                .filter(a -> {
                    if (subject == null && regionId == null && delegationId == null) return true;
                    
                    // Filter by inspector's profile
                    return inspectorProfileRepository.findByUserId(a.getInspector().getId())
                            .map(p -> {
                                boolean matchSubject = (subject == null || p.getSubject() == subject);
                                boolean matchRegion = (regionId == null || p.getDelegations().stream().anyMatch(d -> d.getRegion().getId().equals(regionId)));
                                boolean matchDelegation = (delegationId == null || p.getDelegations().stream().anyMatch(d -> d.getId().equals(delegationId)));
                                return matchSubject && matchRegion && matchDelegation;
                            })
                            .orElse(false);
                })
                .count();

        double averageScore = allReports.stream()
                .filter(r -> r.getScore() != null)
                .mapToInt(ActivityReport::getScore)
                .average()
                .orElse(0);

        long numberOfTeachers = teacherProfileRepository.findAll().stream()
                .filter(t -> subject == null || t.getSubject() == subject)
                .filter(t -> delegationId == null || (t.getDelegation() != null && t.getDelegation().getId().equals(delegationId)))
                .filter(t -> regionId == null || (t.getDelegation() != null && t.getDelegation().getRegion() != null && t.getDelegation().getRegion().getId().equals(regionId)))
                .count();

        long numberOfInspectors = inspectorProfileRepository.findAll().stream()
                .filter(i -> subject == null || i.getSubject() == subject)
                .filter(i -> delegationId == null || i.getDelegations().stream().anyMatch(d -> d.getId().equals(delegationId)))
                .filter(i -> regionId == null || i.getDelegations().stream().anyMatch(d -> d.getRegion().getId().equals(regionId)))
                .count();

        List<TeacherPerformanceDto> allTeacherPerformance = allReports.stream()
                .filter(report -> report.getTeacher() != null && report.getScore() != null)
                .collect(Collectors.groupingBy(ActivityReport::getTeacher))
                .entrySet()
                .stream()
                .map(entry -> mapTeacherPerformance(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparing(TeacherPerformanceDto::getAverageScore).reversed())
                .collect(Collectors.toList());

        List<TeacherPerformanceDto> topPerformingTeachers = allTeacherPerformance.stream()
                .limit(5)
                .collect(Collectors.toList());

        List<TeacherPerformanceDto> lowestPerformingTeachers = allTeacherPerformance.stream()
                .sorted(Comparator.comparing(TeacherPerformanceDto::getAverageScore))
                .limit(5)
                .collect(Collectors.toList());

        // Top Regions
        List<LocationPerformanceDto> topRegions = allReports.stream()
                .filter(r -> r.getTeacher() != null && r.getTeacher().getDelegation() != null && r.getTeacher().getDelegation().getRegion() != null)
                .collect(Collectors.groupingBy(r -> r.getTeacher().getDelegation().getRegion()))
                .entrySet().stream()
                .map(entry -> LocationPerformanceDto.builder()
                        .name(entry.getKey().getName())
                        .averageScore(roundOneDecimal(entry.getValue().stream().filter(r -> r.getScore() != null).mapToInt(ActivityReport::getScore).average().orElse(0)))
                        .reportCount(entry.getValue().size())
                        .build())
                .sorted(Comparator.comparing(LocationPerformanceDto::getAverageScore).reversed())
                .limit(5)
                .collect(Collectors.toList());

        // Top Delegations
        List<LocationPerformanceDto> topDelegations = allReports.stream()
                .filter(r -> r.getTeacher() != null && r.getTeacher().getDelegation() != null)
                .collect(Collectors.groupingBy(r -> r.getTeacher().getDelegation()))
                .entrySet().stream()
                .map(entry -> LocationPerformanceDto.builder()
                        .name(entry.getKey().getName())
                        .averageScore(roundOneDecimal(entry.getValue().stream().filter(r -> r.getScore() != null).mapToInt(ActivityReport::getScore).average().orElse(0)))
                        .reportCount(entry.getValue().size())
                        .build())
                .sorted(Comparator.comparing(LocationPerformanceDto::getAverageScore).reversed())
                .limit(5)
                .collect(Collectors.toList());

        return AdminAnalyticsDto.builder()
                .totalInspections(totalInspections)
                .averageScore(roundOneDecimal(averageScore))
                .numberOfTeachers(numberOfTeachers)
                .numberOfInspectors(numberOfInspectors)
                .topPerformingTeachers(topPerformingTeachers)
                .lowestPerformingTeachers(lowestPerformingTeachers)
                .topPerformingRegions(topRegions)
                .topPerformingDelegations(topDelegations)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public TrendAnalyticsDto getTrends(Subject subject, Long regionId, Long delegationId) {
        List<Activity> activities = activityRepository.findAll();
        List<ActivityReport> reports = reportRepository.findAll();

        activities = activities.stream()
                .filter(a -> {
                    if (subject == null && regionId == null && delegationId == null) return true;
                    return inspectorProfileRepository.findByUserId(a.getInspector().getId())
                            .map(p -> {
                                boolean matchSubject = (subject == null || p.getSubject() == subject);
                                boolean matchRegion = (regionId == null || p.getDelegations().stream().anyMatch(d -> d.getRegion().getId().equals(regionId)));
                                boolean matchDelegation = (delegationId == null || p.getDelegations().stream().anyMatch(d -> d.getId().equals(delegationId)));
                                return matchSubject && matchRegion && matchDelegation;
                            })
                            .orElse(false);
                })
                .collect(Collectors.toList());

        reports = reports.stream()
                .filter(r -> subject == null || (r.getTeacher() != null && r.getTeacher().getSubject() == subject))
                .filter(r -> delegationId == null || (r.getTeacher() != null && r.getTeacher().getDelegation() != null && r.getTeacher().getDelegation().getId().equals(delegationId)))
                .filter(r -> regionId == null || (r.getTeacher() != null && r.getTeacher().getDelegation() != null && r.getTeacher().getDelegation().getRegion() != null && r.getTeacher().getDelegation().getRegion().getId().equals(regionId)))
                .collect(Collectors.toList());

        Map<String, Long> inspectionsPerMonth = activities.stream()
                .filter(a -> a.getType() == ActivityType.INSPECTION && a.getStartDateTime() != null)
                .collect(Collectors.groupingBy(
                        a -> a.getStartDateTime().format(DateTimeFormatter.ofPattern("yyyy-MM")),
                        Collectors.counting()
                ));

        Map<String, Double> performanceEvolution = reports.stream()
                .filter(r -> r.getScore() != null && r.getUpdatedAt() != null)
                .collect(Collectors.groupingBy(
                        r -> r.getUpdatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM")),
                        Collectors.averagingDouble(ActivityReport::getScore)
                ));
        
        performanceEvolution.replaceAll((k, v) -> roundOneDecimal(v));

        return TrendAnalyticsDto.builder()
                .inspectionsPerMonth(inspectionsPerMonth)
                .performanceEvolution(performanceEvolution)
                .build();
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
