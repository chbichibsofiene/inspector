package com.inspector.platform.service.impl;

import com.inspector.platform.dto.ActivityRequest;
import com.inspector.platform.dto.ActivityResponse;
import com.inspector.platform.dto.EtablissementDto;
import com.inspector.platform.dto.TeacherDto;
import com.inspector.platform.entity.Activity;
import com.inspector.platform.entity.TeacherProfile;
import com.inspector.platform.entity.User;
import com.inspector.platform.repository.ActivityReportRepository;
import com.inspector.platform.repository.ActivityRepository;
import com.inspector.platform.repository.InspectorProfileRepository;
import com.inspector.platform.repository.TeacherProfileRepository;
import com.inspector.platform.repository.UserRepository;
import com.inspector.platform.service.ActivityService;
import com.inspector.platform.service.OnlineMeetingService;
import com.inspector.platform.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityServiceImpl implements ActivityService {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final TeacherProfileRepository teacherProfileRepository;
    private final ActivityReportRepository activityReportRepository;
    private final OnlineMeetingService onlineMeetingService;
    private final InspectorProfileRepository inspectorProfileRepository;
    private final NotificationService notificationService;


    @Override
    @Transactional
    public ActivityResponse createActivity(Long inspectorId, ActivityRequest request) {
        User inspector = getUserOrThrow(inspectorId);

        List<TeacherProfile> guests = (request.getGuestTeacherIds() != null && !request.getGuestTeacherIds().isEmpty())
                ? teacherProfileRepository.findAllById(request.getGuestTeacherIds())
                : new ArrayList<>();

        if (request.getStartDateTime().isAfter(request.getEndDateTime())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start time must be before end time");
        }

        Activity activity = Activity.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .startDateTime(request.getStartDateTime())
                .endDateTime(request.getEndDateTime())
                .type(request.getType())
                .location(request.getLocation())
                .inspector(inspector)
                .guests(guests)
                .isOnline(request.isOnline())
                .build();

        // Save first to get ID for Jitsi URLroom uniqueness if needed, 
        // but generateJitsiUrl can handle it before/after.
        Activity savedActivity = activityRepository.save(activity);

        if (request.isOnline()) {
            savedActivity.setMeetingUrl(onlineMeetingService.generateJitsiUrl(request.getTitle(), savedActivity.getId()));
            savedActivity.setLocation("Online");
            savedActivity = activityRepository.save(savedActivity);
        }

        log.info("Created activity: {} for inspector: {}", savedActivity.getTitle(), inspector.getEmail());

        // Notify guests
        if (guests != null && !guests.isEmpty()) {
            for (TeacherProfile guest : guests) {
                try {
                    notificationService.sendNotification(
                        guest.getUser().getId(),
                        "Activity Invitation",
                        "Inspector " + inspector.getSerialCode() + " invited you to: " + savedActivity.getTitle(),
                        "ACTIVITY_INVITE",
                        "/teacher/calendar"
                    );
                } catch (Exception e) {
                    log.error("Failed to notify guest {} for activity {}", guest.getId(), savedActivity.getId());
                }
            }
        }

        return mapToResponse(savedActivity);
    }

    @Override
    @Transactional
    public ActivityResponse updateActivity(Long inspectorId, Long activityId, ActivityRequest request) {
        Activity activity = getActivityAndVerifyOwner(inspectorId, activityId);

        if (request.getStartDateTime().isAfter(request.getEndDateTime())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start time must be before end time");
        }

        List<TeacherProfile> guests = (request.getGuestTeacherIds() != null && !request.getGuestTeacherIds().isEmpty())
                ? teacherProfileRepository.findAllById(request.getGuestTeacherIds())
                : new ArrayList<>();

        activity.setTitle(request.getTitle());
        activity.setDescription(request.getDescription());
        activity.setStartDateTime(request.getStartDateTime());
        activity.setEndDateTime(request.getEndDateTime());
        activity.setType(request.getType());
        activity.setLocation(request.getLocation());
        activity.setGuests(guests);

        if (request.isOnline() && !activity.isOnline()) {
            // Newly switched to online
            activity.setMeetingUrl(onlineMeetingService.generateJitsiUrl(request.getTitle(), activity.getId()));
            activity.setOnline(true);
            activity.setLocation("Online Meeting (Jitsi)");
        } else if (!request.isOnline()) {
            activity.setOnline(false);
            activity.setMeetingUrl(null);
            activity.setLocation(request.getLocation());
        } else {
            activity.setLocation(request.getLocation());
        }

        return mapToResponse(activityRepository.save(activity));

    }

    @Override
    @Transactional
    public void deleteActivity(Long inspectorId, Long activityId) {
        Activity activity = getActivityAndVerifyOwner(inspectorId, activityId);
        // Delete associated reports first to satisfy foreign key constraints
        activityReportRepository.deleteByActivityId(activityId);
        activityRepository.delete(activity);
    }

    @Override
    public ActivityResponse getActivity(Long inspectorId, Long activityId) {
        Activity activity = getActivityAndVerifyOwner(inspectorId, activityId);
        return mapToResponse(activity);
    }

    @Override
    public List<ActivityResponse> getAllActivities(Long inspectorId) {
        return activityRepository.findByInspectorIdOrderByStartDateTimeAsc(inspectorId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityResponse> getTeacherActivities(Long userId) {
        log.info("Fetching activities for teacher user ID: {}", userId);
        try {
            // Find the teacher profile associated with this user
            TeacherProfile teacherProfile = teacherProfileRepository.findByUserId(userId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher profile not found"));

            List<Activity> activities = activityRepository.findTeacherActivities(userId);
            log.info("Found {} activities for user ID: {}", activities.size(), userId);
            
            return activities.stream()
                    .map(activity -> {
                        ActivityResponse response = mapToResponse(activity);
                        // Lookup if a report exists for this specific teacher and activity
                        activityReportRepository.findByActivityIdAndTeacherUserId(activity.getId(), userId)
                                .ifPresent(report -> response.setPersonalReportId(report.getId()));
                        return response;
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving activities for teacher ID {}: {}", userId, e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to load activities", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherDto> getAvailableTeachers() {
        return teacherProfileRepository.findAll().stream()
                .map(this::mapTeacherToDto)
                .collect(Collectors.toList());
    }

    private User getUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Inspector not found"));
    }

    private Activity getActivityAndVerifyOwner(Long inspectorId, Long activityId) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Activity not found"));

        if (!activity.getInspector().getId().equals(inspectorId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not own this activity");
        }
        return activity;
    }

    private ActivityResponse mapToResponse(Activity activity) {
        List<TeacherDto> guestDtos = (activity.getGuests() != null)
                ? activity.getGuests().stream()
                        .map(this::mapTeacherToDto)
                        .collect(Collectors.toList())
                : new ArrayList<>();

        String inspectorName = "Inspector";
        try {
            if (activity.getInspector() != null) {
                var profileOpt = inspectorProfileRepository.findByUserId(activity.getInspector().getId());
                if (profileOpt.isPresent()) {
                    inspectorName = profileOpt.get().getFirstName() + " " + profileOpt.get().getLastName();
                } else {
                    inspectorName = activity.getInspector().getSerialCode();
                }
            }
        } catch (Exception e) {
            log.warn("Could not fetch inspector name for activity {}", activity.getId());
        }

        return ActivityResponse.builder()
                .id(activity.getId())
                .title(activity.getTitle())
                .description(activity.getDescription())
                .startDateTime(activity.getStartDateTime())
                .endDateTime(activity.getEndDateTime())
                .type(activity.getType())
                .location(activity.getLocation())
                .isOnline(activity.isOnline())
                .meetingUrl(activity.getMeetingUrl())
                .inspectorName(inspectorName)
                .guests(guestDtos)
                .build();

    }

    private TeacherDto mapTeacherToDto(TeacherProfile teacher) {
        if (teacher == null) return null;

        TeacherDto.TeacherDtoBuilder builder = TeacherDto.builder()
                .id(teacher.getId())
                .firstName(teacher.getFirstName())
                .lastName(teacher.getLastName());

        try {
            if (teacher.getUser() != null) {
                builder.email(teacher.getUser().getEmail())
                        .serialCode(teacher.getUser().getSerialCode());
            }

            if (teacher.getEtablissement() != null) {
                builder.etablissement(EtablissementDto.builder()
                        .id(teacher.getEtablissement().getId())
                        .name(teacher.getEtablissement().getName())
                        .schoolLevel(teacher.getEtablissement().getSchoolLevel())
                        .build());
            }
        } catch (Exception e) {
            log.warn("Partial data mapping for teacher ID {}: {}", teacher.getId(), e.getMessage());
        }

        return builder.build();
    }
}
