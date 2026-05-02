package com.inspector.platform.controller;

import com.inspector.platform.dto.ActivityResponse;
import com.inspector.platform.dto.ApiResponse;
import com.inspector.platform.entity.User;
import com.inspector.platform.repository.UserRepository;
import com.inspector.platform.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/teacher/activities")
@RequiredArgsConstructor
@PreAuthorize("hasRole('TEACHER')")
public class TeacherActivityController {

    private final ActivityService activityService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getMyActivities(Authentication authentication) {
        try {
            Long userId = extractUserId(authentication);
            List<ActivityResponse> activities = activityService.getTeacherActivities(userId);
            return ResponseEntity.ok(ApiResponse.ok("Teacher activities retrieved successfully", activities));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(java.util.Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getActivityDetails(Authentication authentication, @PathVariable Long id) {
        try {
            Long userId = extractUserId(authentication);
            // We'll add this method to ActivityService
            ActivityResponse activity = activityService.getTeacherActivity(userId, id);
            return ResponseEntity.ok(ApiResponse.ok("Activity details retrieved successfully", activity));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(java.util.Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    private Long extractUserId(Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        return user.getId();
    }
}
