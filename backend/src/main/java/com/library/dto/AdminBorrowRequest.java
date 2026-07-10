package com.library.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AdminBorrowRequest {
    @NotBlank(message = "Member code is required")
    private String memberCode;
    
    @NotBlank(message = "Copy code is required")
    private String copyCode;
}
