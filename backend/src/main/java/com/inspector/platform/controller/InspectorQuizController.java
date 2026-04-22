package com.inspector.platform.controller;

import com.inspector.platform.dto.ApiResponse;
import com.inspector.platform.dto.QuizSaveRequest;
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
@RequestMapping("/api/inspector/quizzes")
@RequiredArgsConstructor
public class InspectorQuizController {

    private final QuizService quizService;
    private final UserRepository userRepository;

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> generateQuiz(
            @RequestParam String topic,
            @RequestParam String subject) {
        return ResponseEntity.ok(ApiResponse.ok("AI questions generated", quizService.generateAIQuestions(topic, subject)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<QuizResponse>> saveQuiz(
            Authentication authentication,
            @RequestBody QuizSaveRequest request) {
        Long userId = extractUserId(authentication);
        return ResponseEntity.ok(ApiResponse.ok("Quiz published successfully", 
            quizService.saveQuiz(userId, request.getTitle(), request.getTopic(), request.getSubject(), request.getQuestions())));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<QuizResponse>>> getMyQuizzes(Authentication authentication) {
        Long userId = extractUserId(authentication);
        return ResponseEntity.ok(ApiResponse.ok("Retrieved inspector quizzes", quizService.getInspectorQuizzes(userId)));
    }

    private Long extractUserId(Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }
}
