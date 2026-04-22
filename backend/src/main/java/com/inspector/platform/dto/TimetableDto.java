package com.inspector.platform.dto;

import com.inspector.platform.entity.TimetableSlot;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimetableDto {
    private Long id;
    private String dayOfWeek;
    private String startTime;
    private String endTime;
    private String subject;
    private String classroom;
    private String level;

    public static TimetableDto from(TimetableSlot slot) {
        return TimetableDto.builder()
                .id(slot.getId())
                .dayOfWeek(slot.getDayOfWeek().name())
                .startTime(slot.getStartTime().toString())
                .endTime(slot.getEndTime().toString())
                .subject(slot.getSubject().name())
                .classroom(slot.getClassroom())
                .level(slot.getLevel())
                .build();
    }
}
