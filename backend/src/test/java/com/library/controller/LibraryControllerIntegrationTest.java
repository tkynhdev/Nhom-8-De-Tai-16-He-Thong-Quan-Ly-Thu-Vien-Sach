package com.library.controller;

import com.library.config.SecurityConfig;
import com.library.dto.StatisticsOverviewResponse;
import com.library.security.JwtAuthenticationFilter;
import com.library.security.JwtUtils;
import com.library.service.StatisticsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = StatisticsController.class)
@Import(SecurityConfig.class)
class LibraryControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JwtUtils jwtUtils;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    private UserDetailsService userDetailsService;

    @MockBean
    private StatisticsService statisticsService;

    @BeforeEach
    void passThroughJwtFilter() throws Exception {
        doAnswer(invocation -> {
            FilterChain chain = invocation.getArgument(2);
            chain.doFilter(invocation.<ServletRequest>getArgument(0), invocation.<ServletResponse>getArgument(1));
            return null;
        }).when(jwtAuthenticationFilter).doFilter(any(ServletRequest.class), any(ServletResponse.class), any(FilterChain.class));
    }

    @Test
    @DisplayName("Member cannot access librarian statistics API")
    void testAccessAdminApi_WithMemberRole_ShouldReturn403() throws Exception {
        mockMvc.perform(get("/api/v1/admin/statistics/overview")
                        .with(user("member").roles("MEMBER"))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Librarian can read real statistics overview payload")
    void testGetStatistics_WithLibrarianRole_ShouldReturn200AndValidData() throws Exception {
        when(statisticsService.getOverview()).thenReturn(
                StatisticsOverviewResponse.builder()
                        .totalActiveLoans(152)
                        .totalOverdue(14)
                        .availableCopies(1024)
                        .monthlyFinesCollected(new BigDecimal("250000"))
                        .popularBooks(List.of())
                        .topMembers(List.of())
                        .build()
        );

        mockMvc.perform(get("/api/v1/admin/statistics/overview")
                        .with(user("admin").roles("LIBRARIAN"))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalActiveLoans").value(152))
                .andExpect(jsonPath("$.totalOverdue").value(14))
                .andExpect(jsonPath("$.availableCopies").value(1024));
    }
}
