package com.library.dto;

import com.library.enums.CardType;
import com.library.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberRequest {
    @NotBlank
    private String memberCode;
    
    private String password;
    
    @NotBlank
    private String name;
    
    @NotBlank
    @Email
    private String email;
    
    private String phone;
    
    @NotNull
    private UserRole role;
    
    @NotNull
    private CardType cardType;
    
    @NotNull
    private LocalDate cardExpiryDate;
}
