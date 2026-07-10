package com.library.service;

import com.library.entity.Reservation;

import java.util.List;

/**
 * Manages reservations for books that are currently unavailable.
 */
public interface ReservationService {

    Reservation reserveBook(Long memberId, Long bookId);

    List<Reservation> getReservationsForMember(Long memberId);

    Reservation cancelReservation(Long reservationId, Long memberId);
}
