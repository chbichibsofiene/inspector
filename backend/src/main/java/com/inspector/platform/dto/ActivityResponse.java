package com.inspector.platform.dto;

import com.inspector.platform.entity.ActivityType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private ActivityType type;
    private String location;
    private List<TeacherDto> guests;
    private Long personalReportId;
    private String inspectorName;
    @com.fasterxml.jackson.annotation.JsonProperty("isOnline")
    private boolean isOnline;
    private String meetingUrl;

}
