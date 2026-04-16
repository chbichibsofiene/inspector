package com.inspector.platform.service;

import com.inspector.platform.dto.TeacherProfileRequest;
import com.inspector.platform.dto.TeacherProfileResponse;

public interface TeacherProfileService {
    TeacherProfileResponse completeProfile(Long userId, TeacherProfileRequest request);
    TeacherProfileResponse updateProfile(Long userId, TeacherProfileRequest request);
    TeacherProfileResponse getProfile(Long userId);
}
