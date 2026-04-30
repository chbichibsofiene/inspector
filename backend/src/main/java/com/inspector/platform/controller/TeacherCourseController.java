package com.inspector.platform.controller;

import com.inspector.platform.dto.ApiResponse;
import com.inspector.platform.dto.CourseResponse;
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
@RequestMapping("/api/teacher/courses")
@RequiredArgsConstructor
public class TeacherCourseController {

    private final CourseService courseService;
    private final UserRepository userRepository;

    /** Get all courses assigned to this teacher */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getMyCourses(Authentication auth) {
        Long userId = extractUserId(auth);
        return ResponseEntity.ok(ApiResponse.ok("Assigned courses", courseService.getTeacherCourses(userId)));
    }

    /** Get full detail of a course (with lesson completion status) */
    @GetMapping("/{courseId}")
    public ResponseEntity<ApiResponse<CourseResponse>> getCourseDetail(
            Authentication auth,
            @PathVariable Long courseId) {
        Long userId = extractUserId(auth);
        return ResponseEntity.ok(ApiResponse.ok("Course detail", courseService.getTeacherCourseDetail(userId, courseId)));
    }

    /** Mark a lesson as completed */
    @PostMapping("/lessons/{lessonId}/complete")
    public ResponseEntity<ApiResponse<Void>> markComplete(
            Authentication auth,
            @PathVariable Long lessonId,
            @RequestBody(required = false) Map<String, Integer> body) {
        Long userId = extractUserId(auth);
        Integer score = (body != null) ? body.get("score") : null;
        courseService.markLessonComplete(userId, lessonId, score);
        return ResponseEntity.ok(ApiResponse.ok("Lesson marked complete", null));
    }

    private Long extractUserId(Authentication auth) {
        String email = ((UserDetails) auth.getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }
}
