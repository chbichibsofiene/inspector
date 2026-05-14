package com.inspector.platform.service;

public interface PdfExportService {
    byte[] exportReport(Long userId, Long reportId, boolean isTeacher);
    void importReportPdf(Long inspectorId, Long reportId, String fileName, byte[] content);
    String getReportPdfFileName(Long userId, Long reportId, boolean isTeacher);
}
