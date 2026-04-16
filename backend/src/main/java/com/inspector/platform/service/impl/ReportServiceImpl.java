package com.inspector.platform.service.impl;

import com.inspector.platform.dto.EtablissementDto;
import com.inspector.platform.dto.ReportRequest;
import com.inspector.platform.dto.ReportResponse;
import com.inspector.platform.dto.TeacherDto;
import com.inspector.platform.entity.Activity;
import com.inspector.platform.entity.ActivityReport;
import com.inspector.platform.entity.TeacherProfile;
import com.inspector.platform.entity.User;
import com.inspector.platform.repository.ActivityReportRepository;
import com.inspector.platform.repository.ActivityRepository;
import com.inspector.platform.repository.TeacherProfileRepository;
import com.inspector.platform.repository.UserRepository;
import com.inspector.platform.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ActivityReportRepository reportRepository;
    private final ActivityRepository activityRepository;
    private final TeacherProfileRepository teacherProfileRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ReportResponse createReport(Long inspectorId, ReportRequest request) {
        User inspector = userRepository.findById(inspectorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Inspector not found"));
        Activity activity = getActivityAndVerifyOwner(inspectorId, request.getActivityId());
        TeacherProfile teacher = getTeacherIfPresent(activity, request.getTeacherId());

        ActivityReport report = ActivityReport.builder()
                .activity(activity)
                .inspector(inspector)
                .teacher(teacher)
                .title(request.getTitle())
                .observations(request.getObservations())
                .recommendations(request.getRecommendations())
                .score(request.getScore())
                .status(request.getStatus())
                .build();

        return mapToResponse(reportRepository.save(report));
    }

    @Override
    @Transactional
    public ReportResponse updateReport(Long inspectorId, Long reportId, ReportRequest request) {
        ActivityReport report = getReportAndVerifyOwner(inspectorId, reportId);
        Activity activity = getActivityAndVerifyOwner(inspectorId, request.getActivityId());
        TeacherProfile teacher = getTeacherIfPresent(activity, request.getTeacherId());

        report.setActivity(activity);
        report.setTeacher(teacher);
        report.setTitle(request.getTitle());
        report.setObservations(request.getObservations());
        report.setRecommendations(request.getRecommendations());
        report.setScore(request.getScore());
        report.setStatus(request.getStatus());

        return mapToResponse(reportRepository.save(report));
    }

    @Override
    @Transactional
    public void deleteReport(Long inspectorId, Long reportId) {
        ActivityReport report = getReportAndVerifyOwner(inspectorId, reportId);
        reportRepository.delete(report);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReportResponse> getReports(Long inspectorId, Long activityId) {
        List<ActivityReport> reports = activityId == null
                ? reportRepository.findByInspectorIdOrderByUpdatedAtDesc(inspectorId)
                : reportRepository.findByActivityIdAndInspectorIdOrderByUpdatedAtDesc(activityId, inspectorId);

        return reports.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private Activity getActivityAndVerifyOwner(Long inspectorId, Long activityId) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Activity not found"));

        if (!activity.getInspector().getId().equals(inspectorId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not own this activity");
        }

        return activity;
    }

    private ActivityReport getReportAndVerifyOwner(Long inspectorId, Long reportId) {
        ActivityReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found"));

        if (!report.getInspector().getId().equals(inspectorId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not own this report");
        }

        return report;
    }

    private TeacherProfile getTeacherIfPresent(Activity activity, Long teacherId) {
        if (teacherId == null) {
            return null;
        }

        TeacherProfile teacher = teacherProfileRepository.findById(teacherId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher not found"));

        boolean isActivityGuest = activity.getGuests().stream()
                .anyMatch(guest -> guest.getId().equals(teacherId));
        if (!isActivityGuest) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Teacher must be a guest of the selected activity");
        }

        return teacher;
    }

    private ReportResponse mapToResponse(ActivityReport report) {
        Activity activity = report.getActivity();

        return ReportResponse.builder()
                .id(report.getId())
                .activityId(activity.getId())
                .activityTitle(activity.getTitle())
                .activityType(activity.getType())
                .activityStartDateTime(activity.getStartDateTime())
                .teacher(report.getTeacher() == null ? null : mapTeacherToDto(report.getTeacher()))
                .title(report.getTitle())
                .observations(report.getObservations())
                .recommendations(report.getRecommendations())
                .score(report.getScore())
                .hasImportedPdf(report.getImportedPdf() != null && report.getImportedPdf().length > 0)
                .importedPdfFileName(report.getImportedPdfFileName())
                .status(report.getStatus())
                .createdAt(report.getCreatedAt())
                .updatedAt(report.getUpdatedAt())
                .build();
    }

    private TeacherDto mapTeacherToDto(TeacherProfile teacher) {
        return TeacherDto.builder()
                .id(teacher.getId())
                .firstName(teacher.getFirstName())
                .lastName(teacher.getLastName())
                .email(teacher.getUser().getEmail())
                .serialCode(teacher.getUser().getSerialCode())
                .etablissement(new EtablissementDto(
                        teacher.getEtablissement().getId(),
                        teacher.getEtablissement().getName(),
                        teacher.getEtablissement().getSchoolLevel()))
                .build();
    }
}
