package com.inspector.platform.controller;

import com.inspector.platform.dto.ApiResponse;
import com.inspector.platform.dto.QuizResponse;
import com.inspector.platform.entity.User;
import com.inspector.platform.repository.UserRepository;
import com.inspector.platform.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teacher/quizzes")
@RequiredArgsConstructor
public class TeacherQuizController {

    private final QuizService quizService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<QuizResponse>>> getAvailableQuizzes(
            Authentication authentication) {
        Long userId = extractUserId(authentication);
        return ResponseEntity.ok(ApiResponse.ok("Quizzes retrieved", quizService.getAvailableQuizzes(userId)));
    }

    @PostMapping("/{quizId}/submit")
    public ResponseEntity<ApiResponse<Map<String, Object>>> submitQuiz(
            Authentication authentication,
            @PathVariable Long quizId,
            @RequestBody Map<Long, String> answers) {
        Long userId = extractUserId(authentication);
        return ResponseEntity.ok(ApiResponse.ok("Quiz submitted and evaluated", quizService.submitQuiz(userId, quizId, answers)));
    }

    private Long extractUserId(Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }
}
