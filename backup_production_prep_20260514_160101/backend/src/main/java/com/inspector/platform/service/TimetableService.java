package com.inspector.platform.service;

import com.inspector.platform.dto.TimetableDto;

import java.util.List;

public interface TimetableService {
    List<TimetableDto> getTimetable(Long userId);
    TimetableDto addSlot(Long userId, TimetableDto dto);
    void deleteSlot(Long userId, Long slotId);
}
