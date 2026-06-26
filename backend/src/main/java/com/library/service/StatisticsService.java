package com.library.service;

import com.library.dto.StatisticsOverviewResponse;

/**
 * Aggregates reporting metrics for librarian dashboards.
 */
public interface StatisticsService {

    StatisticsOverviewResponse getOverview();
}
