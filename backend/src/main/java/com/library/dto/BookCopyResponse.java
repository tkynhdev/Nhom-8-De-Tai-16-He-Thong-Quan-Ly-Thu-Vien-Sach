package com.library.dto;

import lombok.Builder;
import lombok.Value;

/**
 * Lightweight projection for inventory screens.
 */
@Value
@Builder
public class BookCopyResponse {
    Long id;
    String copyCode;
    String bookTitle;
    String status;
    String shelfLocation;
}
