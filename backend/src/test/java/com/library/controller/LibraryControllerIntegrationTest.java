package com.library.controller;

import com.library.config.SecurityConfig;
import com.library.security.JwtAuthenticationFilter;
import com.library.security.JwtUtils;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = StatisticsController.class)
@Import(SecurityConfig.class)
public class LibraryControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JwtUtils jwtUtils;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    private UserDetailsService userDetailsService;

    @Test
    @DisplayName("7. Bảo mật: Member cố tình gọi API quản lý của Librarian (trả về 403 Forbidden)")
    void testAccessAdminApi_WithMemberRole_ShouldReturn403() throws Exception {
        mockMvc.perform(get("/api/v1/admin/statistics/overview")
                .with(user("member").roles("MEMBER"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("8. Thống kê: API trả về đúng sách phổ biến nhất (với Role LIBRARIAN)")
    void testGetStatistics_WithLibrarianRole_ShouldReturn200AndValidData() throws Exception {
        mockMvc.perform(get("/api/v1/admin/statistics/overview")
                .with(user("admin").roles("LIBRARIAN"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.popularBooks").value("MERN Stack Blueprint"))
                .andExpect(jsonPath("$.totalOverdue").value(14));
    }
}
