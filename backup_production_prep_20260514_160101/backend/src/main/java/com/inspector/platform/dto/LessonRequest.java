package com.inspector.platform.dto;

import com.inspector.platform.entity.LessonType;
import lombok.Data;

@Data
public class LessonRequest {
    private String title;
    private LessonType type;
    private String contentUrl;
    private String description;
    private Integer durationMinutes;
    private Integer orderIndex;
}
