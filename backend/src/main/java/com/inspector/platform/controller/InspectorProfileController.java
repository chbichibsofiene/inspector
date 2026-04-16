package com.inspector.platform.controller;

import com.inspector.platform.dto.ApiResponse;
import com.inspector.platform.dto.EtablissementDto;
import com.inspector.platform.dto.InspectorProfileRequest;
import com.inspector.platform.dto.InspectorProfileResponse;
import com.inspector.platform.dto.ReferenceDto;
import com.inspector.platform.dto.TeacherDto;
import com.inspector.platform.service.InspectorProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.inspector.platform.entity.User;
import com.inspector.platform.repository.UserRepository;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inspector/profile")
@RequiredArgsConstructor
public class InspectorProfileController {

    private final InspectorProfileService profileService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<InspectorProfileResponse>> completeProfile(
            Authentication authentication,
            @Valid @RequestBody InspectorProfileRequest request) {
            
        Long userId = extractUserId(authentication);
        InspectorProfileResponse response = profileService.completeProfile(userId, request);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Profile completed successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<InspectorProfileResponse>> getProfile(
            Authentication authentication) {
            
        Long userId = extractUserId(authentication);
        InspectorProfileResponse response = profileService.getProfile(userId);
        
        return ResponseEntity.ok(ApiResponse.ok("Profile retrieved successfully", response));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<InspectorProfileResponse>> updateProfile(
            Authentication authentication,
            @Valid @RequestBody InspectorProfileRequest request) {
            
        Long userId = extractUserId(authentication);
        InspectorProfileResponse response = profileService.updateProfile(userId, request);
        
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", response));
    }
    
    @GetMapping("/my-teachers")
    public ResponseEntity<ApiResponse<List<TeacherDto>>> getMyTeachers(Authentication authentication) {
        Long userId = extractUserId(authentication);
        return ResponseEntity.ok(ApiResponse.ok("Teachers retrieved successfully", profileService.getMyTeachers(userId)));
    }
    
    @GetMapping("/ranks")
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> getRanks() {
        return ResponseEntity.ok(ApiResponse.ok("Ranks retrieved", profileService.getRanks()));
    }

    @GetMapping("/subjects")
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> getSubjects() {
        return ResponseEntity.ok(ApiResponse.ok("Subjects retrieved", profileService.getSubjects()));
    }

    @GetMapping("/school-levels")
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> getSchoolLevels() {
        return ResponseEntity.ok(ApiResponse.ok("School levels retrieved", profileService.getSchoolLevels()));
    }

    @GetMapping("/delegations")
    public ResponseEntity<ApiResponse<List<ReferenceDto>>> getDelegations() {
        return ResponseEntity.ok(ApiResponse.ok("Delegations retrieved", profileService.getDelegations()));
    }

    @GetMapping("/dependencies")
    public ResponseEntity<ApiResponse<List<ReferenceDto>>> getDependencies(
            @RequestParam Long delegationId) {
        return ResponseEntity.ok(ApiResponse.ok("Dependencies retrieved", profileService.getDependenciesByDelegation(delegationId)));
    }

    @GetMapping("/departments")
    public ResponseEntity<ApiResponse<List<ReferenceDto>>> getDepartments(
            @RequestParam Long delegationId) {
        return ResponseEntity.ok(ApiResponse.ok("Departments retrieved", profileService.getDepartmentsByDelegation(delegationId)));
    }

    @GetMapping("/etablissements")
    public ResponseEntity<ApiResponse<List<EtablissementDto>>> getEtablissements(
            @RequestParam Long dependencyId,
            @RequestParam(required = false) String schoolLevel) {
        
        List<EtablissementDto> result;
        if (schoolLevel != null && !schoolLevel.isBlank()) {
            result = profileService.getEtablissementsByDependencyAndSchoolLevel(dependencyId, schoolLevel);
        } else {
            result = profileService.getEtablissementsByDependency(dependencyId);
        }
        
        return ResponseEntity.ok(ApiResponse.ok("Etablissements retrieved", result));
    }
    
    // Helper to safely extract user ID from the JWT principal
    private Long extractUserId(Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        return user.getId();
    }
}
