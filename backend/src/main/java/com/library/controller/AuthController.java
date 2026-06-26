package com.library.controller;

import com.library.dto.AuthRequest;
import com.library.dto.AuthResponse;
import com.library.dto.RefreshTokenRequest;
import com.library.entity.Member;
import com.library.exception.ResourceNotFoundException;
import com.library.repository.MemberRepository;
import com.library.security.JwtUtils;
import com.library.security.MemberPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Issues JWT access and refresh tokens for the frontend.
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final MemberRepository memberRepository;
    private final JwtUtils jwtUtils;

    /**
     * Logs a member in using the member code and returns both tokens.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        Member member = memberRepository.findByMemberCode(request.getMemberCode())
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with code: " + request.getMemberCode()));

        UserDetails principal = MemberPrincipal.fromMember(member);
        return ResponseEntity.ok(buildAuthResponse(member, principal));
    }

    /**
     * Refreshes the access token when the current access token expires.
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();
        if (!jwtUtils.isRefreshToken(refreshToken)) {
            throw new IllegalArgumentException("Provided token is not a refresh token.");
        }

        String memberCode = jwtUtils.extractUsername(refreshToken);
        Member member = memberRepository.findByMemberCode(memberCode)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with code: " + memberCode));

        UserDetails principal = MemberPrincipal.fromMember(member);
        return ResponseEntity.ok(buildAuthResponse(member, principal));
    }

    private AuthResponse buildAuthResponse(Member member, UserDetails principal) {
        return AuthResponse.builder()
                .accessToken(jwtUtils.generateToken(principal))
                .refreshToken(jwtUtils.generateRefreshToken(principal))
                .memberCode(member.getMemberCode())
                .role(member.getRole() == null ? "MEMBER" : member.getRole().name())
                .build();
    }
}
