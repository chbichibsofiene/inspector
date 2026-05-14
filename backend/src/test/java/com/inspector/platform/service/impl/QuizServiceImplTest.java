package com.inspector.platform.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.inspector.platform.repository.*;
import com.inspector.platform.service.NotificationService;
import com.inspector.platform.service.LogService;
import com.inspector.platform.service.ai.GeminiService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class QuizServiceImplTest {

    @Mock
    private QuizRepository quizRepository;
    @Mock
    private QuizSubmissionRepository submissionRepository;
    @Mock
    private InspectorProfileRepository inspectorRepository;
    @Mock
    private TeacherProfileRepository teacherRepository;
    @Mock
    private GeminiService geminiService;
    @Mock
    private ObjectMapper objectMapper;
    @Mock
    private NotificationService notificationService;
    @Mock
    private LogService logService;

    @InjectMocks
    private QuizServiceImpl quizService;

    @Test
    void generateAIQuestions_Success() throws Exception {
        // Arrange
        String topic = "Math";
        String subject = "Algebra";
        String schoolLevel = "High School";
        String grade = "10th";
        String mockJson = "[{\"text\": \"What is 1+1?\", \"type\": \"MCQ\", \"correctAnswer\": \"2\"}]";
        List<Map<String, Object>> expectedList = Collections.singletonList(
                Map.of("text", "What is 1+1?", "type", "MCQ", "correctAnswer", "2")
        );

        when(geminiService.generateQuizContent(topic, subject, schoolLevel, grade)).thenReturn(mockJson);
        when(objectMapper.readValue(eq(mockJson), any(TypeReference.class))).thenReturn(expectedList);

        // Act
        List<Map<String, Object>> result = quizService.generateAIQuestions(topic, subject, schoolLevel, grade);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("What is 1+1?", result.get(0).get("text"));
    }

    @Test
    void generateAIQuestions_Failure() throws Exception {
        // Arrange
        when(geminiService.generateQuizContent(anyString(), anyString(), anyString(), anyString()))
                .thenReturn("invalid json");
        when(objectMapper.readValue(anyString(), any(TypeReference.class)))
                .thenThrow(new RuntimeException("Parse error"));

        // Act & Assert
        assertThrows(ResponseStatusException.class, () -> 
            quizService.generateAIQuestions("topic", "subject", "level", "grade")
        );
    }
}
