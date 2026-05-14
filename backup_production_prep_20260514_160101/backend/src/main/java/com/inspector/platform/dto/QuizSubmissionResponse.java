package com.inspector.platform.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuizSubmissionResponse {
    private Long id;
    private String quizTitle;
    private String quizTopic;
    private Integer score;
    private String evaluationText;
    private String trainingSuggestion;
    private String submittedAt;
}
