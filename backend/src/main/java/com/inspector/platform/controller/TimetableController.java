package com.inspector.platform.controller;

import com.inspector.platform.dto.ApiResponse;
import com.inspector.platform.dto.TimetableDto;
import com.inspector.platform.entity.User;
import com.inspector.platform.repository.UserRepository;
import com.inspector.platform.service.TimetableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher/timetable")
@RequiredArgsConstructor
@PreAuthorize("hasRole('TEACHER')")
public class TimetableController {

    private final TimetableService timetableService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getMyTimetable(Authentication authentication) {
        Long userId = extractUserId(authentication);
        List<TimetableDto> timetable = timetableService.getTimetable(userId);
        return ResponseEntity.ok(ApiResponse.ok("Timetable retrieved successfully", timetable));
    }

    @PostMapping
    public ResponseEntity<?> addSlot(@RequestBody TimetableDto dto, Authentication authentication) {
        Long userId = extractUserId(authentication);
        TimetableDto saved = timetableService.addSlot(userId, dto);
        return ResponseEntity.ok(ApiResponse.ok("Slot added successfully", saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSlot(@PathVariable Long id, Authentication authentication) {
        Long userId = extractUserId(authentication);
        timetableService.deleteSlot(userId, id);
        return ResponseEntity.ok(ApiResponse.ok("Slot deleted successfully", null));
    }

    private Long extractUserId(Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        return user.getId();
    }
}
