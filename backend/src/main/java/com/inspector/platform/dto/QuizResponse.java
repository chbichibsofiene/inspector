package com.inspector.platform.dto;

import com.inspector.platform.entity.QuizQuestion;
import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizResponse {
    private Long id;
    private String title;
    private String subject;
    private String topic;
    private List<QuestionDto> questions;
    private String createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionDto {
        private Long id;
        private String text;
        private QuizQuestion.QuestionType type;
        private List<String> options; // For MCQ
        private String correctAnswer; // Only populated for inspectors
    }
}
