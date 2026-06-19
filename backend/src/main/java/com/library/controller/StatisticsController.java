package com.library.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/statistics")
@RequiredArgsConstructor
@Tag(name = "Statistics", description = "Admin API for library reports and statistics")
@SecurityRequirement(name = "bearerAuth")
public class StatisticsController {

    @Operation(summary = "Get general statistics", description = "Retrieve popular books, active members, and overdue rates")
    @PreAuthorize("hasRole('LIBRARIAN')")
    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getOverviewStatistics() {
        Map<String, Object> stats = Map.of(
                "totalActiveLoans", 152,
                "totalOverdue", 14,
                "popularBooks", "MERN Stack Blueprint",
                "monthlyFinesCollected", 250000
        );
        return ResponseEntity.ok(stats);
    }
}
