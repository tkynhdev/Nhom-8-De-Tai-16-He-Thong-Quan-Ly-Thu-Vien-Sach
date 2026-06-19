package com.library.entity;

import com.library.enums.CardType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Member code cannot be blank")
    @Column(name = "member_code", nullable = false, unique = true, length = 50)
    private String memberCode;

    @NotBlank(message = "Full name cannot be blank")
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email format is not valid")
    @Column(nullable = false, unique = true)
    private String email;

    @Column(unique = true, length = 20)
    private String phone;

    @NotNull(message = "Card type cannot be null")
    @Enumerated(EnumType.STRING)
    @Column(name = "card_type", nullable = false, length = 20)
    private CardType cardType;

    @NotNull(message = "Card expiry date cannot be null")
    @Future(message = "Card expiry date must be in the future")
    @Column(name = "card_expiry_date", nullable = false)
    private LocalDate cardExpiryDate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
