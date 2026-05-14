package com.inspector.platform.dto;

import com.inspector.platform.entity.CourseStatus;
import com.inspector.platform.entity.Subject;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class CourseResponse {
    private Long id;
    private String title;
    private String description;
    private Subject subject;
    private CourseStatus status;
    private String inspectorName;
    private int totalModules;
    private int totalLessons;
    private int assignedTeachers;
    private LocalDateTime createdAt;
    // Teacher-specific progress fields (null for inspector view)
    private Integer completedLessons;
    private Integer progressPercent;
    // Full modules (for detail view)
    private List<ModuleResponse> modules;
}
