package com.library.service;

import com.library.dto.BookCopyResponse;

import java.util.List;

/**
 * Exposes physical copy inventory for librarian tooling.
 */
public interface InventoryService {

    List<BookCopyResponse> getAllCopies();
}
