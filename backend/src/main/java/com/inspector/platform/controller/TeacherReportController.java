package com.inspector.platform.controller;

import com.inspector.platform.dto.ApiResponse;
import com.inspector.platform.dto.ReportResponse;
import com.inspector.platform.entity.User;
import com.inspector.platform.repository.UserRepository;
import com.inspector.platform.service.PdfExportService;
import com.inspector.platform.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher/reports")
@RequiredArgsConstructor
@PreAuthorize("hasRole('TEACHER')")
public class TeacherReportController {

    private final ReportService reportService;
    private final PdfExportService pdfExportService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReportResponse>>> getMyReports(Authentication authentication) {
        Long teacherUserId = extractUserId(authentication);
        return ResponseEntity.ok(ApiResponse.ok("Your reports retrieved successfully", reportService.getTeacherReports(teacherUserId)));
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadReportPdf(
            Authentication authentication,
            @PathVariable Long id) {
        Long teacherUserId = extractUserId(authentication);
        
        byte[] pdf = pdfExportService.exportReport(teacherUserId, id, true);
        String fileName = pdfExportService.getReportPdfFileName(teacherUserId, id, true);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    private Long extractUserId(Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        return user.getId();
    }
}
