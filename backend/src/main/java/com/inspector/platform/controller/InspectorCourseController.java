package com.inspector.platform.controller;

import com.inspector.platform.dto.*;
import com.inspector.platform.entity.User;
import com.inspector.platform.repository.UserRepository;
import com.inspector.platform.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inspector/courses")
@RequiredArgsConstructor
public class InspectorCourseController {

    private final CourseService courseService;
    private final UserRepository userRepository;

    /** Create a new course (DRAFT) */
    @PostMapping
    public ResponseEntity<ApiResponse<CourseResponse>> createCourse(
            Authentication auth,
            @RequestBody CourseCreateRequest request) {
        Long userId = extractUserId(auth);
        return ResponseEntity.ok(ApiResponse.ok("Course created", courseService.createCourse(userId, request)));
    }

    /** List all courses created by this inspector */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getMyCourses(Authentication auth) {
        Long userId = extractUserId(auth);
        return ResponseEntity.ok(ApiResponse.ok("Inspector courses", courseService.getInspectorCourses(userId)));
    }

    /** Get full detail of a specific course */
    @GetMapping("/{courseId}")
    public ResponseEntity<ApiResponse<CourseResponse>> getCourseDetail(
            Authentication auth,
            @PathVariable Long courseId) {
        Long userId = extractUserId(auth);
        return ResponseEntity.ok(ApiResponse.ok("Course detail", courseService.getCourseDetail(userId, courseId)));
    }

    /** Publish a course (DRAFT → PUBLISHED) */
    @PatchMapping("/{courseId}/publish")
    public ResponseEntity<ApiResponse<CourseResponse>> publishCourse(
            Authentication auth,
            @PathVariable Long courseId) {
        Long userId = extractUserId(auth);
        return ResponseEntity.ok(ApiResponse.ok("Course published", courseService.publishCourse(userId, courseId)));
    }

    /** Add a module to an existing course */
    @PostMapping("/{courseId}/modules")
    public ResponseEntity<ApiResponse<CourseResponse>> addModule(
            Authentication auth,
            @PathVariable Long courseId,
            @RequestBody ModuleRequest moduleRequest) {
        Long userId = extractUserId(auth);
        return ResponseEntity.ok(ApiResponse.ok("Module added", courseService.addModule(userId, courseId, moduleRequest)));
    }

    /** Assign a teacher to a course */
    @PostMapping("/{courseId}/assign/{teacherUserId}")
    public ResponseEntity<ApiResponse<Void>> assignTeacher(
            Authentication auth,
            @PathVariable Long courseId,
            @PathVariable Long teacherUserId) {
        Long userId = extractUserId(auth);
        courseService.assignTeacher(userId, courseId, teacherUserId);
        return ResponseEntity.ok(ApiResponse.ok("Teacher assigned", null));
    }

    /** Remove a teacher from a course */
    @DeleteMapping("/{courseId}/assign/{teacherUserId}")
    public ResponseEntity<ApiResponse<Void>> unassignTeacher(
            Authentication auth,
            @PathVariable Long courseId,
            @PathVariable Long teacherUserId) {
        Long userId = extractUserId(auth);
        courseService.unassignTeacher(userId, courseId, teacherUserId);
        return ResponseEntity.ok(ApiResponse.ok("Teacher removed", null));
    }

    /** Get per-teacher progress overview for a course */
    @GetMapping("/{courseId}/progress")
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getCourseProgress(
            Authentication auth,
            @PathVariable Long courseId) {
        Long userId = extractUserId(auth);
        return ResponseEntity.ok(ApiResponse.ok("Progress overview", courseService.getCourseProgressOverview(userId, courseId)));
    }

    /** Delete a course */
    @DeleteMapping("/{courseId}")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(
            Authentication auth,
            @PathVariable Long courseId) {
        Long userId = extractUserId(auth);
        courseService.deleteCourse(userId, courseId);
        return ResponseEntity.ok(ApiResponse.ok("Course deleted", null));
    }

    /** Delete a module from a course */
    @DeleteMapping("/{courseId}/modules/{moduleId}")
    public ResponseEntity<ApiResponse<Void>> deleteModule(
            Authentication auth,
            @PathVariable Long courseId,
            @PathVariable Long moduleId) {
        Long userId = extractUserId(auth);
        courseService.deleteModule(userId, courseId, moduleId);
        return ResponseEntity.ok(ApiResponse.ok("Module deleted", null));
    }

    private Long extractUserId(Authentication auth) {
        String email = ((UserDetails) auth.getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }
}
