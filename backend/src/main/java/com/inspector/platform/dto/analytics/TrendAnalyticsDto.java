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
    // Monthly (default)
    private Map<String, Long>   inspectionsPerMonth;
    private Map<String, Double> performanceEvolution;

    // Weekly
    private Map<String, Long>   inspectionsPerWeek;
    private Map<String, Double> performanceEvolutionWeekly;

    // Yearly
    private Map<String, Long>   inspectionsPerYear;
    private Map<String, Double> performanceEvolutionYearly;
}
