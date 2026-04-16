package com.inspector.platform.dto;

import com.inspector.platform.entity.ReportStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReportRequest {

    @NotNull(message = "Activity is required")
    private Long activityId;

    private Long teacherId;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Observations are required")
    private String observations;

    private String recommendations;

    @Min(value = 0, message = "Score must be at least 0")
    @Max(value = 20, message = "Score must be at most 20")
    private Integer score;

    @NotNull(message = "Status is required")
    private ReportStatus status;
}
