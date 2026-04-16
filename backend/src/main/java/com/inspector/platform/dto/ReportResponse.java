package com.inspector.platform.dto;

import com.inspector.platform.entity.ActivityType;
import com.inspector.platform.entity.ReportStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {
    private Long id;
    private Long activityId;
    private String activityTitle;
    private ActivityType activityType;
    private LocalDateTime activityStartDateTime;
    private TeacherDto teacher;
    private String title;
    private String observations;
    private String recommendations;
    private Integer score;
    private boolean hasImportedPdf;
    private String importedPdfFileName;
    private ReportStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
