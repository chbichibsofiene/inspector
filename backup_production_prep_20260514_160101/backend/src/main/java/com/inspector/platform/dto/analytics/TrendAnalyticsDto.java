package com.inspector.platform.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrendAnalyticsDto {
    private Map<String, Long> inspectionsPerMonth;
    private Map<String, Double> performanceEvolution;
}
