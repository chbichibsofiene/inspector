package com.inspector.platform.service;

import com.inspector.platform.dto.ActivityRequest;
import com.inspector.platform.dto.ActivityResponse;
import com.inspector.platform.dto.TeacherDto;

import java.util.List;

public interface ActivityService {
    ActivityResponse createActivity(Long inspectorId, ActivityRequest request);
    ActivityResponse updateActivity(Long inspectorId, Long activityId, ActivityRequest request);
    void deleteActivity(Long inspectorId, Long activityId);
    ActivityResponse getActivity(Long inspectorId, Long activityId);
    List<ActivityResponse> getAllActivities(Long inspectorId);
    List<TeacherDto> getAvailableTeachers();
}
