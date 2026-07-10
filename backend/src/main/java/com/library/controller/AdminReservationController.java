package com.library.controller;

import com.library.dto.ReservationResponse;
import com.library.entity.Reservation;
import com.library.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/reservations")
@RequiredArgsConstructor
@Tag(name = "Admin Reservations", description = "Admin API for managing reservations")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
public class AdminReservationController {

    private final ReservationService reservationService;

    @Operation(summary = "Get pending reservations")
    @GetMapping("/pending")
    public ResponseEntity<List<ReservationResponse>> getPendingReservations() {
        return ResponseEntity.ok(
                reservationService.getPendingReservations().stream()
                        .map(this::mapReservation)
                        .toList());
    }

    private ReservationResponse mapReservation(Reservation reservation) {
        return ReservationResponse.builder()
                .id(reservation.getId())
                .bookId(reservation.getBook().getId())
                .bookTitle(reservation.getBook().getTitle())
                .memberId(reservation.getMember().getId())
                .memberCode(reservation.getMember().getMemberCode())
                .reservationDate(reservation.getReservationDate())
                .status(reservation.getStatus().name())
                .build();
    }
}
