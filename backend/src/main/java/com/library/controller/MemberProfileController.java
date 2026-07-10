package com.library.controller;

import com.library.dto.MemberRequest;
import com.library.dto.MemberResponse;
import com.library.security.MemberPrincipal;
import com.library.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/member/profile")
@RequiredArgsConstructor
@Tag(name = "Member Profile", description = "Member API for managing their own profile")
@SecurityRequirement(name = "bearerAuth")
public class MemberProfileController {

    private final MemberService memberService;

    @Operation(summary = "Update own profile")
    @PutMapping
    public ResponseEntity<MemberResponse> updateProfile(
            @Valid @RequestBody MemberRequest request,
            @AuthenticationPrincipal MemberPrincipal principal) {
        
        return ResponseEntity.ok(memberService.updateProfile(principal.getId(), request));
    }
}
