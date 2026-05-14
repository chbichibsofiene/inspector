package com.inspector.platform.dto;

import com.inspector.platform.entity.ActivityType;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
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

    private String location;

    private List<Long> guestTeacherIds;

    @com.fasterxml.jackson.annotation.JsonProperty("isOnline")
    private boolean isOnline;

}
