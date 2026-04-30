package com.inspector.platform.dto;

import com.inspector.platform.entity.Subject;
import lombok.Data;
import java.util.List;

@Data
public class CourseCreateRequest {
    private String title;
    private String description;
    private Subject subject;
    private List<ModuleRequest> modules;
}
