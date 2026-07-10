package com.library.dto;

import com.library.enums.CardType;
import com.library.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberResponse {
    private Long id;
    private String memberCode;
    private String name;
    private String email;
    private String phone;
    private UserRole role;
    private CardType cardType;
    private LocalDate cardExpiryDate;
    private String status; // Derived status like ACTIVE, EXPIRED based on expiry date
}
