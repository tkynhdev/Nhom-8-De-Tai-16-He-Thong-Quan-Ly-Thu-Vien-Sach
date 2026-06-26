package com.library.dto;

import lombok.Builder;
import lombok.Value;

/**
 * Token bundle returned after login or refresh.
 */
@Value
@Builder
public class AuthResponse {
    String accessToken;
    String refreshToken;
    String memberCode;
    String role;
}
