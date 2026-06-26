package com.library.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Request payload for access token renewal.
 */
@Data
public class RefreshTokenRequest {

    @NotBlank(message = "Refresh token is required")
    private String refreshToken;
}
