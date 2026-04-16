package com.inspector.platform.service.impl;

import com.inspector.platform.dto.ActivityRequest;
import com.inspector.platform.dto.ActivityResponse;
import com.inspector.platform.dto.EtablissementDto;
import com.inspector.platform.dto.TeacherDto;
import com.inspector.platform.entity.Activity;
import com.inspector.platform.entity.TeacherProfile;
import com.inspector.platform.entity.User;
import com.inspector.platform.repository.ActivityRepository;
import com.inspector.platform.repository.TeacherProfileRepository;
import com.inspector.platform.repository.UserRepository;
import com.inspector.platform.service.ActivityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityServiceImpl implements ActivityService {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final TeacherProfileRepository teacherProfileRepository;

    @Override
    @Transactional
    public ActivityResponse createActivity(Long inspectorId, ActivityRequest request) {
        User inspector = getUserOrThrow(inspectorId);

        List<TeacherProfile> guests = teacherProfileRepository.findAllById(request.getGuestTeacherIds());
        if (guests.isEmpty() || guests.size() != request.getGuestTeacherIds().size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Some guest teachers were not found");
        }

        if (request.getStartDateTime().isAfter(request.getEndDateTime())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start time must be before end time");
        }

        Activity activity = Activity.builder()
                .inspector(inspector)
                .title(request.getTitle())
                .description(request.getDescription())
                .startDateTime(request.getStartDateTime())
                .endDateTime(request.getEndDateTime())
                .type(request.getType())
                .location(request.getLocation())
                .guests(guests)
                .build();

        return mapToResponse(activityRepository.save(activity));
    }

    @Override
    @Transactional
    public ActivityResponse updateActivity(Long inspectorId, Long activityId, ActivityRequest request) {
        Activity activity = getActivityAndVerifyOwner(inspectorId, activityId);

        List<TeacherProfile> guests = teacherProfileRepository.findAllById(request.getGuestTeacherIds());
        if (guests.isEmpty() || guests.size() != request.getGuestTeacherIds().size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Some guest teachers were not found");
        }

        if (request.getStartDateTime().isAfter(request.getEndDateTime())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start time must be before end time");
        }

        activity.setTitle(request.getTitle());
        activity.setDescription(request.getDescription());
        activity.setStartDateTime(request.getStartDateTime());
        activity.setEndDateTime(request.getEndDateTime());
        activity.setType(request.getType());
        activity.setLocation(request.getLocation());
        activity.setGuests(guests);

        return mapToResponse(activityRepository.save(activity));
    }

    @Override
    @Transactional
    public void deleteActivity(Long inspectorId, Long activityId) {
        Activity activity = getActivityAndVerifyOwner(inspectorId, activityId);
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
        List<TeacherDto> guestDtos = activity.getGuests().stream()
                .map(this::mapTeacherToDto)
                .collect(Collectors.toList());

        return ActivityResponse.builder()
                .id(activity.getId())
                .title(activity.getTitle())
                .description(activity.getDescription())
                .startDateTime(activity.getStartDateTime())
                .endDateTime(activity.getEndDateTime())
                .type(activity.getType())
                .location(activity.getLocation())
                .guests(guestDtos)
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
