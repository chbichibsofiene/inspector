package com.inspector.platform.service.impl;

import com.inspector.platform.dto.TimetableDto;
import com.inspector.platform.entity.TeacherProfile;
import com.inspector.platform.entity.TimetableSlot;
import com.inspector.platform.repository.TeacherProfileRepository;
import com.inspector.platform.repository.TimetableRepository;
import com.inspector.platform.service.TimetableService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TimetableServiceImpl implements TimetableService {

    private final TimetableRepository timetableRepository;
    private final TeacherProfileRepository teacherProfileRepository;
    private final com.inspector.platform.service.LogService logService;

    @Override
    public List<TimetableDto> getTimetable(Long userId) {
        TeacherProfile profile = teacherProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Teacher profile not found"));
        
        return timetableRepository.findByTeacherId(profile.getId())
                .stream()
                .map(TimetableDto::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TimetableDto addSlot(Long userId, TimetableDto dto) {
        TeacherProfile profile = teacherProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Teacher profile not found"));

        TimetableSlot slot = TimetableSlot.builder()
                .teacher(profile)
                .dayOfWeek(DayOfWeek.valueOf(dto.getDayOfWeek().toUpperCase()))
                .startTime(LocalTime.parse(dto.getStartTime()))
                .endTime(LocalTime.parse(dto.getEndTime()))
                .subject(com.inspector.platform.entity.Subject.valueOf(dto.getSubject().toUpperCase()))
                .classroom(dto.getClassroom())
                .level(dto.getLevel())
                .build();

        TimetableSlot saved = timetableRepository.save(slot);
        logService.log(com.inspector.platform.entity.ActionType.CREATE, "TimetableSlot", saved.getId().toString(), "Added timetable slot: " + saved.getDayOfWeek() + " " + saved.getStartTime());
        return TimetableDto.from(saved);
    }

    @Override
    @Transactional
    public void deleteSlot(Long userId, Long slotId) {
        TimetableSlot slot = timetableRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));
        
        if (!slot.getTeacher().getUser().getId().equals(userId)) {
            throw new RuntimeException("Not authorized to delete this slot");
        }

        timetableRepository.delete(slot);
        logService.log(com.inspector.platform.entity.ActionType.DELETE, "TimetableSlot", slotId.toString(), "Deleted timetable slot: " + slot.getDayOfWeek() + " " + slot.getStartTime());
    }
}
