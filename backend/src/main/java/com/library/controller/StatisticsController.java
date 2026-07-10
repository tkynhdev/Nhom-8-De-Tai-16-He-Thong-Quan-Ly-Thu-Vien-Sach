package com.library.controller;

import com.library.dto.StatisticsOverviewResponse;
import com.library.service.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Provides librarian/admin reporting endpoints backed by persisted data.
 */
@RestController
@RequestMapping("/api/v1/admin/statistics")
@RequiredArgsConstructor
@Tag(name = "Statistics", description = "Admin API for library reports and statistics")
@SecurityRequirement(name = "bearerAuth")
public class StatisticsController {

    private final StatisticsService statisticsService;

    @Operation(summary = "Get general statistics", description = "Retrieve popular books, active members, and overdue rates")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    @GetMapping("/overview")
    public ResponseEntity<StatisticsOverviewResponse> getOverviewStatistics() {
        return ResponseEntity.ok(statisticsService.getOverview());
    }
}
