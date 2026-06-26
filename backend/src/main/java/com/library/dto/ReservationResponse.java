package com.library.dto;

import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;

/**
 * Reservation view exposed to the frontend.
 */
@Value
@Builder
public class ReservationResponse {
    Long id;
    Long bookId;
    String bookTitle;
    Long memberId;
    String memberCode;
    LocalDateTime reservationDate;
    String status;
}
