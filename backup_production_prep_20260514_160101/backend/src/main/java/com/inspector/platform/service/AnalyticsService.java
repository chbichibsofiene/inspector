package com.inspector.platform.service;

import com.inspector.platform.dto.analytics.InspectorAnalyticsDto;

import com.inspector.platform.dto.analytics.AdminAnalyticsDto;
import com.inspector.platform.dto.analytics.TrendAnalyticsDto;

public interface AnalyticsService {
    InspectorAnalyticsDto getInspectorAnalytics(Long inspectorId);
    AdminAnalyticsDto getAdminAnalytics(com.inspector.platform.entity.Subject subject, Long regionId, Long delegationId);
    TrendAnalyticsDto getTrends(com.inspector.platform.entity.Subject subject, Long regionId, Long delegationId);
}
