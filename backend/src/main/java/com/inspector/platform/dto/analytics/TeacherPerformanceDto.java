package com.inspector.platform.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherPerformanceDto {
    private Long teacherId;
    private String teacherName;
    private long reportCount;
    private double averageScore;
}
