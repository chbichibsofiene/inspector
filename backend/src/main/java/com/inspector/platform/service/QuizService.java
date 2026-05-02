package com.inspector.platform.service;

import com.inspector.platform.dto.QuizResponse;

import java.util.List;
import java.util.Map;

public interface QuizService {
    List<Map<String, Object>> generateAIQuestions(String topic, String subject);
    QuizResponse saveQuiz(Long inspectorUserId, String title, String topic, String subject, List<Map<String, Object>> questionData, List<Long> targetTeacherIds);
    List<QuizResponse> getAvailableQuizzes(Long teacherUserId);
    List<QuizResponse> getInspectorQuizzes(Long inspectorUserId);
    QuizResponse getQuizDetail(Long quizId);
    Map<String, Object> submitQuiz(Long teacherUserId, Long quizId, Map<Long, String> answers);
}
