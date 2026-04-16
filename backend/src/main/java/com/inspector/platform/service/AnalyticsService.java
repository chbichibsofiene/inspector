package com.inspector.platform.service;

import com.inspector.platform.dto.analytics.InspectorAnalyticsDto;

public interface AnalyticsService {
    InspectorAnalyticsDto getInspectorAnalytics(Long inspectorId);
}
