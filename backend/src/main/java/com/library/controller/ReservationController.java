package com.library.controller;

import com.library.dto.ReservationRequest;
import com.library.dto.ReservationResponse;
import com.library.entity.Reservation;
import com.library.security.MemberPrincipal;
import com.library.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Exposes reservation endpoints for members.
 */
@RestController
@RequestMapping("/api/v1/reservations")
@RequiredArgsConstructor
@Tag(name = "Reservations", description = "API for placing and managing book reservations")
@SecurityRequirement(name = "bearerAuth")
public class ReservationController {

    private final ReservationService reservationService;

    /**
     * Places a reservation for the authenticated member.
     */
    @PostMapping
    public ResponseEntity<ReservationResponse> reserveBook(
            @Valid @RequestBody ReservationRequest request,
            @AuthenticationPrincipal MemberPrincipal principal) {

        Reservation reservation = reservationService.reserveBook(principal.getId(), request.getBookId());
        return ResponseEntity.status(HttpStatus.CREATED).body(mapReservation(reservation));
    }

    /**
     * Returns the authenticated member's reservation queue.
     */
    @GetMapping("/my-reservations")
    public ResponseEntity<List<ReservationResponse>> getMyReservations(
            @AuthenticationPrincipal MemberPrincipal principal) {
        return ResponseEntity.ok(
                reservationService.getReservationsForMember(principal.getId()).stream()
                        .map(this::mapReservation)
                        .toList());
    }

    /**
     * Cancels a reservation that belongs to the authenticated member.
     */
    @DeleteMapping("/{reservationId}")
    public ResponseEntity<ReservationResponse> cancelReservation(
            @PathVariable Long reservationId,
            @AuthenticationPrincipal MemberPrincipal principal) {
        Reservation reservation = reservationService.cancelReservation(reservationId, principal.getId());
        return ResponseEntity.ok(mapReservation(reservation));
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
