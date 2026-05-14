package com.inspector.platform.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class QuizSaveRequest {
    private String title;
    private String topic;
    private String subject;
    private List<Map<String, Object>> questions;
    private List<Long> targetTeacherIds;
}
