package com.inspector.platform.controller;

import com.inspector.platform.dto.ActivityRequest;
import com.inspector.platform.dto.ActivityResponse;
import com.inspector.platform.dto.ApiResponse;
import com.inspector.platform.dto.TeacherDto;
import com.inspector.platform.entity.User;
import com.inspector.platform.repository.UserRepository;
import com.inspector.platform.service.ActivityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inspector/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<ActivityResponse>> createActivity(
            Authentication authentication,
            @Valid @RequestBody ActivityRequest request) {
        Long inspectorId = extractUserId(authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Activity created successfully", activityService.createActivity(inspectorId, request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ActivityResponse>> updateActivity(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody ActivityRequest request) {
        Long inspectorId = extractUserId(authentication);
        return ResponseEntity.ok(ApiResponse.ok("Activity updated successfully", activityService.updateActivity(inspectorId, id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteActivity(
            Authentication authentication,
            @PathVariable Long id) {
        Long inspectorId = extractUserId(authentication);
        activityService.deleteActivity(inspectorId, id);
        return ResponseEntity.ok(ApiResponse.ok("Activity deleted successfully", null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ActivityResponse>> getActivity(
            Authentication authentication,
            @PathVariable Long id) {
        Long inspectorId = extractUserId(authentication);
        return ResponseEntity.ok(ApiResponse.ok("Activity retrieved successfully", activityService.getActivity(inspectorId, id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ActivityResponse>>> getAllActivities(
            Authentication authentication) {
        Long inspectorId = extractUserId(authentication);
        return ResponseEntity.ok(ApiResponse.ok("Activities retrieved successfully", activityService.getAllActivities(inspectorId)));
    }

    @GetMapping("/teachers")
    public ResponseEntity<ApiResponse<List<TeacherDto>>> getAvailableTeachers() {
        return ResponseEntity.ok(ApiResponse.ok("Available teachers retrieved successfully", activityService.getAvailableTeachers()));
    }

    private Long extractUserId(Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        return user.getId();
    }
}
