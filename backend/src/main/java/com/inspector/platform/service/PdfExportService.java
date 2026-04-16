package com.inspector.platform.service;

public interface PdfExportService {
    byte[] exportReport(Long inspectorId, Long reportId);
    void importReportPdf(Long inspectorId, Long reportId, String fileName, byte[] content);
    String getReportPdfFileName(Long inspectorId, Long reportId);
}
