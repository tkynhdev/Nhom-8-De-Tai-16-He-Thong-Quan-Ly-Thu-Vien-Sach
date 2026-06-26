package com.library.dto;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;
import java.util.List;

/**
 * Aggregated report payload for librarian and admin dashboards.
 */
@Value
@Builder
public class StatisticsOverviewResponse {
    long totalActiveLoans;
    long totalOverdue;
    long availableCopies;
    BigDecimal monthlyFinesCollected;
    List<PopularBookResponse> popularBooks;
    List<MemberActivityResponse> topMembers;
}
