package com.library.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Request payload for creating a reservation.
 */
@Data
public class ReservationRequest {

    @NotNull(message = "Book ID is required")
    private Long bookId;
}
