package com.inspector.platform.dto;

import com.inspector.platform.entity.LessonType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LessonResponse {
    private Long id;
    private String title;
    private LessonType type;
    private String contentUrl;
    private String description;
    private Integer durationMinutes;
    private Integer orderIndex;
    private boolean completed;
    private Integer score;
}
