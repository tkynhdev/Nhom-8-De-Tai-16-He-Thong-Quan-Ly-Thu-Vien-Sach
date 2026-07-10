package com.library.service;

import com.library.dto.BookCopyResponse;

import java.util.List;

/**
 * Exposes physical copy inventory for librarian tooling.
 */
public interface InventoryService {

    List<BookCopyResponse> getAllCopies();
    
    BookCopyResponse createCopy(com.library.dto.BookCopyRequest request);
    
    BookCopyResponse updateCopy(Long id, com.library.dto.BookCopyRequest request);
    
    void deleteCopy(Long id);
}
