package com.library.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Request payload for token issuance.
 */
@Data
public class AuthRequest {

    @NotBlank(message = "Member code is required")
    private String memberCode;
}
