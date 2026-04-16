package com.inspector.platform.dto;

import com.inspector.platform.entity.ActivityType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ActivityRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Start date time is required")
    private LocalDateTime startDateTime;

    @NotNull(message = "End date time is required")
    private LocalDateTime endDateTime;

    @NotNull(message = "Activity type is required")
    private ActivityType type;

    @NotBlank(message = "Location/Place is required")
    private String location;

    @NotEmpty(message = "At least one guest (teacher) is required")
    private List<Long> guestTeacherIds;
}
