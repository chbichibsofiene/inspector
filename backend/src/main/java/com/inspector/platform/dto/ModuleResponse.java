package com.inspector.platform.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class ModuleResponse {
    private Long id;
    private String title;
    private String description;
    private Integer orderIndex;
    private List<LessonResponse> lessons;
    private int completedLessons;
    private int totalLessons;
}
