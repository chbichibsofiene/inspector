package com.inspector.platform.service;

import com.inspector.platform.dto.ReportRequest;
import com.inspector.platform.dto.ReportResponse;

import java.util.List;

public interface ReportService {
    ReportResponse createReport(Long inspectorId, ReportRequest request);
    ReportResponse updateReport(Long inspectorId, Long reportId, ReportRequest request);
    void deleteReport(Long inspectorId, Long reportId);
    List<ReportResponse> getReports(Long inspectorId, Long activityId);
}
