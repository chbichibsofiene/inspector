package com.inspector.platform.service.impl;

import com.inspector.platform.dto.*;
import com.inspector.platform.entity.*;
import com.inspector.platform.repository.*;
import com.inspector.platform.service.InspectorProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class InspectorProfileServiceImpl implements InspectorProfileService {

    private final InspectorProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final DelegationRepository delegationRepository;
    private final DependencyRepository dependencyRepository;
    private final DepartmentRepository departmentRepository;
    private final EtablissementRepository etablissementRepository;
    private final TeacherProfileRepository teacherProfileRepository;

    @Override
    @Transactional
    public InspectorProfileResponse completeProfile(Long userId, InspectorProfileRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.isProfileCompleted()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Profile is already completed");
        }

        if (profileRepository.existsByUserId(userId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Profile already exists");
        }

        List<Delegation> delegations = delegationRepository.findAllById(request.getDelegationIds());
        if (delegations.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid delegation IDs");
        }

        List<Dependency> dependencies = dependencyRepository.findAllById(request.getDependencyIds());
        if (dependencies.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid dependency IDs");
        }

        List<Department> departments = departmentRepository.findAllById(request.getDepartmentIds());
        if (departments.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid department IDs");
        }

        List<Etablissement> etablissements = etablissementRepository.findAllById(request.getEtablissementIds());
        if (etablissements.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid etablissement IDs");
        }

        InspectorProfile profile = InspectorProfile.builder()
                .user(user)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .rank(request.getRank())
                .subject(request.getSubject())
                .schoolLevel(request.getSchoolLevel())
                .phone(request.getPhone())
                .language(request.getLanguage())
                .delegations(delegations)
                .dependencies(dependencies)
                .departments(departments)
                .etablissements(etablissements)
                .build();

        InspectorProfile savedProfile = profileRepository.save(profile);

        user.setProfileCompleted(true);
        user.setProfileImageUrl(request.getProfileImageUrl());
        userRepository.save(user);

        log.info("Inspector profile completed for user {}", user.getEmail());

        return mapToResponse(savedProfile);
    }

    @Override
    @Transactional(readOnly = true)
    public InspectorProfileResponse getProfile(Long userId) {
        InspectorProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));
        return mapToResponse(profile);
    }

    @Override
    @Transactional
    public InspectorProfileResponse updateProfile(Long userId, InspectorProfileRequest request) {
        InspectorProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));

        List<Delegation> delegations = delegationRepository.findAllById(request.getDelegationIds());
        List<Dependency> dependencies = dependencyRepository.findAllById(request.getDependencyIds());
        List<Department> departments = departmentRepository.findAllById(request.getDepartmentIds());

        List<Etablissement> etablissements = etablissementRepository.findAllById(request.getEtablissementIds());

        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setRank(request.getRank());
        profile.setSubject(request.getSubject());
        profile.setSchoolLevel(request.getSchoolLevel());
        profile.setPhone(request.getPhone());
        profile.setLanguage(request.getLanguage());
        profile.setDelegations(delegations);
        profile.setDependencies(dependencies);
        profile.setDepartments(departments);
        profile.setEtablissements(etablissements);

        User user = profile.getUser();
        user.setProfileImageUrl(request.getProfileImageUrl());
        userRepository.save(user);

        InspectorProfile updatedProfile = profileRepository.save(profile);
        return mapToResponse(updatedProfile);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherDto> getMyTeachers(Long inspectorUserId) {
        InspectorProfile inspector = profileRepository.findByUserId(inspectorUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Inspector profile not found"));
                
        List<Long> delegationIds = inspector.getDelegations().stream().map(Delegation::getId).collect(Collectors.toList());
        List<Long> dependencyIds = inspector.getDependencies().stream().map(Dependency::getId).collect(Collectors.toList());
        
        log.info("Filtering teachers for Inspector {}: Delegations={}, Dependencies={}, Subject={}", 
                inspectorUserId, delegationIds, dependencyIds, inspector.getSubject());

        // Safety check: Avoid invalid SQL "IN ()" queries if jurisdiction is not defined
        if (delegationIds.isEmpty() || dependencyIds.isEmpty()) {
            log.warn("Inspector {} has an incomplete jurisdiction profile (empty delegations/dependencies). Returning empty teacher list.", inspectorUserId);
            return Collections.emptyList();
        }
        
        List<TeacherProfile> teachers = teacherProfileRepository.findByDelegationIdInAndDependencyIdInAndSubject(
                delegationIds,
                dependencyIds,
                inspector.getSubject()
        );
        
        log.info("Found {} teachers matching criteria", teachers.size());
        
        return teachers.stream().map(t -> TeacherDto.builder()
                .id(t.getId())
                .userId(t.getUser().getId())
                .firstName(t.getFirstName())
                .lastName(t.getLastName())
                .email(t.getUser().getEmail())
                .serialCode(t.getUser().getSerialCode())
                .subject(t.getSubject() != null ? t.getSubject().name() : null)
                .profileImageUrl(t.getUser().getProfileImageUrl())
                .etablissement(new EtablissementDto(t.getEtablissement().getId(), t.getEtablissement().getName(), t.getEtablissement().getSchoolLevel()))
                .build()).collect(Collectors.toList());
    }

    @Override
    public List<Map<String, String>> getRanks() {
        return Arrays.stream(InspectorRank.values())
                .map(rank -> Map.of("name", rank.name(), "label", toLabel(rank.name())))
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, String>> getSubjects() {
        return Arrays.stream(Subject.values())
                .map(s -> Map.of("name", s.name(), "label", toLabel(s.name())))
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, String>> getSchoolLevels() {
        return Arrays.stream(SchoolLevel.values())
                .map(l -> Map.of("name", l.name(), "label", toLabel(l.name())))
                .collect(Collectors.toList());
    }

    @Override
    public List<ReferenceDto> getDelegations() {
        return delegationRepository.findAll().stream()
                .map(d -> new ReferenceDto(d.getId(), d.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ReferenceDto> getDependenciesByDelegation(Long delegationId) {
        return dependencyRepository.findByDelegationId(delegationId).stream()
                .map(d -> new ReferenceDto(d.getId(), d.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ReferenceDto> getDepartmentsByDelegation(Long delegationId) {
        return departmentRepository.findByDelegationId(delegationId).stream()
                .map(d -> new ReferenceDto(d.getId(), d.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public List<EtablissementDto> getEtablissementsByDependency(Long dependencyId) {
        return etablissementRepository.findByDependencyId(dependencyId).stream()
                .map(e -> new EtablissementDto(e.getId(), e.getName(), e.getSchoolLevel()))
                .collect(Collectors.toList());
    }

    @Override
    public List<EtablissementDto> getEtablissementsByDependencyAndSchoolLevel(Long dependencyId, String schoolLevelStr) {
        try {
            SchoolLevel level = SchoolLevel.valueOf(schoolLevelStr);
            return etablissementRepository.findByDependencyIdAndSchoolLevel(dependencyId, level).stream()
                    .map(e -> new EtablissementDto(e.getId(), e.getName(), e.getSchoolLevel()))
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid school level");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<TimetableDto> getTeacherTimetable(Long inspectorUserId, Long teacherProfileId) {
        TeacherProfile teacher = verifyTeacherLinkAndGet(inspectorUserId, teacherProfileId);
        
        return timetableRepository.findByTeacherId(teacher.getId())
                .stream()
                .map(TimetableDto::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReportResponse> getTeacherReports(Long inspectorUserId, Long teacherProfileId) {
        TeacherProfile teacher = verifyTeacherLinkAndGet(inspectorUserId, teacherProfileId);
        
        // Fetch all reports for this teacher. 
        // Note: Repository uses teacher's User ID
        return reportRepository.findByTeacherUserIdAndStatusOrderByUpdatedAtDesc(teacher.getUser().getId(), ReportStatus.FINAL)
                .stream()
                .map(this::mapReportToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuizSubmissionResponse> getTeacherQuizzes(Long inspectorUserId, Long teacherProfileId) {
        TeacherProfile teacher = verifyTeacherLinkAndGet(inspectorUserId, teacherProfileId);

        return quizSubmissionRepository.findByTeacherUserId(teacher.getUser().getId())
                .stream()
                .map(this::mapQuizSubmissionToResponse)
                .collect(Collectors.toList());
    }

    private QuizSubmissionResponse mapQuizSubmissionToResponse(QuizSubmission submission) {
        return QuizSubmissionResponse.builder()
                .id(submission.getId())
                .quizTitle(submission.getQuiz().getTitle())
                .quizTopic(submission.getQuiz().getTopic())
                .score(submission.getScore())
                .evaluationText(submission.getEvaluationText())
                .trainingSuggestion(submission.getTrainingSuggestion())
                .submittedAt(submission.getSubmittedAt().toString())
                .build();
    }

    private TeacherProfile verifyTeacherLinkAndGet(Long inspectorUserId, Long teacherProfileId) {
        InspectorProfile inspector = profileRepository.findByUserId(inspectorUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Inspector profile not found"));
                
        TeacherProfile teacher = teacherProfileRepository.findById(teacherProfileId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher profile not found"));

        // Verify Delegation, Dependency, and Subject
        boolean delegationMatch = inspector.getDelegations().stream()
                .anyMatch(d -> d.getId().equals(teacher.getDelegation().getId()));
        
        boolean dependencyMatch = inspector.getDependencies().stream()
                .anyMatch(d -> d.getId().equals(teacher.getDependency().getId()));
                
        boolean subjectMatch = inspector.getSubject() == teacher.getSubject();

        if (!delegationMatch || !dependencyMatch || !subjectMatch) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Teacher is outside of your jurisdiction");
        }

        return teacher;
    }

    private ReportResponse mapReportToResponse(ActivityReport report) {
        Activity activity = report.getActivity();
        return ReportResponse.builder()
                .id(report.getId())
                .activityId(activity.getId())
                .activityTitle(activity.getTitle())
                .activityType(activity.getType())
                .activityStartDateTime(activity.getStartDateTime())
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

    private final TimetableRepository timetableRepository;
    private final ActivityReportRepository reportRepository;
    private final QuizSubmissionRepository quizSubmissionRepository;

    private InspectorProfileResponse mapToResponse(InspectorProfile profile) {
        return InspectorProfileResponse.builder()
                .id(profile.getId())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .rank(profile.getRank())
                .subject(profile.getSubject())
                .schoolLevel(profile.getSchoolLevel())
                .phone(profile.getPhone())
                .language(profile.getLanguage())
                .delegations(profile.getDelegations().stream()
                        .map(d -> new ReferenceDto(d.getId(), d.getName()))
                        .collect(Collectors.toList()))
                .dependencies(profile.getDependencies().stream()
                        .map(d -> new ReferenceDto(d.getId(), d.getName()))
                        .collect(Collectors.toList()))
                .departments(profile.getDepartments().stream()
                        .map(d -> new ReferenceDto(d.getId(), d.getName()))
                        .collect(Collectors.toList()))
                .etablissements(profile.getEtablissements().stream()
                        .map(e -> new EtablissementDto(e.getId(), e.getName(), e.getSchoolLevel()))
                        .collect(Collectors.toList()))
                .build();
    }

    /** Converts SNAKE_CASE enum names to "Title Case" labels */
    private String toLabel(String enumName) {
        String[] parts = enumName.split("_");
        StringBuilder sb = new StringBuilder();
        for (String part : parts) {
            if (sb.length() > 0) sb.append(" ");
            sb.append(part.charAt(0)).append(part.substring(1).toLowerCase());
        }
        return sb.toString();
    }
}
