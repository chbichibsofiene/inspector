package com.inspector.platform.controller;

import com.inspector.platform.dto.ApiResponse;
import com.inspector.platform.dto.TeacherProfileRequest;
import com.inspector.platform.dto.TeacherProfileResponse;
import com.inspector.platform.service.TeacherProfileService;
import com.inspector.platform.entity.User;
import com.inspector.platform.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teacher/profile")
@RequiredArgsConstructor
public class TeacherProfileController {

    private final TeacherProfileService profileService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<TeacherProfileResponse>> completeProfile(
            Authentication authentication,
            @Valid @RequestBody TeacherProfileRequest request) {
            
        Long userId = extractUserId(authentication);
        TeacherProfileResponse response = profileService.completeProfile(userId, request);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Teacher profile completed successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<TeacherProfileResponse>> getProfile(
            Authentication authentication) {
            
        Long userId = extractUserId(authentication);
        TeacherProfileResponse response = profileService.getProfile(userId);
        
        return ResponseEntity.ok(ApiResponse.ok("Teacher profile retrieved successfully", response));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<TeacherProfileResponse>> updateProfile(
            Authentication authentication,
            @Valid @RequestBody TeacherProfileRequest request) {
            
        Long userId = extractUserId(authentication);
        TeacherProfileResponse response = profileService.updateProfile(userId, request);
        
        return ResponseEntity.ok(ApiResponse.ok("Teacher profile updated successfully", response));
    }

    private Long extractUserId(Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        return user.getId();
    }
}
