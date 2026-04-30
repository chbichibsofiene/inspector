package com.inspector.platform.dto;

import lombok.Data;
import java.util.List;

@Data
public class ModuleRequest {
    private String title;
    private String description;
    private Integer orderIndex;
    private List<LessonRequest> lessons;
}
