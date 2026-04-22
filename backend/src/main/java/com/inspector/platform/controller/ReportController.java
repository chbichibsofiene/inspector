package com.inspector.platform.controller;

import com.inspector.platform.dto.ApiResponse;
import com.inspector.platform.dto.ReportRequest;
import com.inspector.platform.dto.ReportResponse;
import com.inspector.platform.entity.User;
import com.inspector.platform.repository.UserRepository;
import com.inspector.platform.service.PdfExportService;
import com.inspector.platform.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/inspector/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    private final PdfExportService pdfExportService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReportResponse>>> getReports(
            Authentication authentication,
            @RequestParam(required = false) Long activityId) {
        Long inspectorId = extractUserId(authentication);
        return ResponseEntity.ok(ApiResponse.ok("Reports retrieved successfully", reportService.getReports(inspectorId, activityId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReportResponse>> createReport(
            Authentication authentication,
            @Valid @RequestBody ReportRequest request) {
        Long inspectorId = extractUserId(authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Report created successfully", reportService.createReport(inspectorId, request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ReportResponse>> updateReport(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody ReportRequest request) {
        Long inspectorId = extractUserId(authentication);
        return ResponseEntity.ok(ApiResponse.ok("Report updated successfully", reportService.updateReport(inspectorId, id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReport(
            Authentication authentication,
            @PathVariable Long id) {
        Long inspectorId = extractUserId(authentication);
        reportService.deleteReport(inspectorId, id);
        return ResponseEntity.ok(ApiResponse.ok("Report deleted successfully", null));
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> exportReportPdf(
            Authentication authentication,
            @PathVariable Long id) {
        Long inspectorId = extractUserId(authentication);
        byte[] pdf = pdfExportService.exportReport(inspectorId, id, false);
        String fileName = pdfExportService.getReportPdfFileName(inspectorId, id, false);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @PostMapping(value = "/{id}/pdf-import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Void>> importReportPdf(
            Authentication authentication,
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {
        Long inspectorId = extractUserId(authentication);

        if (!MediaType.APPLICATION_PDF_VALUE.equalsIgnoreCase(file.getContentType())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Only PDF files are accepted"));
        }

        pdfExportService.importReportPdf(inspectorId, id, file.getOriginalFilename(), file.getBytes());
        return ResponseEntity.ok(ApiResponse.ok("PDF imported successfully", null));
    }

    private Long extractUserId(Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        return user.getId();
    }
}
