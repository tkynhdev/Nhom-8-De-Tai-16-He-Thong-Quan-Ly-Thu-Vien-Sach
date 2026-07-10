package com.library.service.impl;

import com.library.dto.BookCopyResponse;
import com.library.entity.BookCopy;
import com.library.repository.BookCopyRepository;
import com.library.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Reads the physical-copy inventory and maps it to a UI-friendly response.
 */
@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private final BookCopyRepository bookCopyRepository;
    private final com.library.repository.BookRepository bookRepository;

    @Override
    public List<BookCopyResponse> getAllCopies() {
        return bookCopyRepository.findAllWithBookOrderByUpdatedAtDesc()
                .stream()
                .map(this::mapCopy)
                .toList();
    }

    @Override
    public BookCopyResponse createCopy(com.library.dto.BookCopyRequest request) {
        if (bookCopyRepository.findByCopyCode(request.getCopyCode()).isPresent()) {
            throw new com.library.exception.BusinessRuleException("Copy code already exists");
        }
        
        com.library.entity.Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new com.library.exception.ResourceNotFoundException("Book not found"));
                
        BookCopy copy = BookCopy.builder()
                .book(book)
                .copyCode(request.getCopyCode())
                .status(request.getStatus())
                .shelfLocation(request.getShelfLocation())
                .build();
                
        return mapCopy(bookCopyRepository.save(copy));
    }

    @Override
    public BookCopyResponse updateCopy(Long id, com.library.dto.BookCopyRequest request) {
        BookCopy copy = bookCopyRepository.findById(id)
                .orElseThrow(() -> new com.library.exception.ResourceNotFoundException("Book copy not found"));
                
        // Check uniqueness if changed
        if (!copy.getCopyCode().equals(request.getCopyCode()) && 
            bookCopyRepository.findByCopyCode(request.getCopyCode()).isPresent()) {
            throw new com.library.exception.BusinessRuleException("Copy code already exists");
        }
        
        if (!copy.getBook().getId().equals(request.getBookId())) {
            com.library.entity.Book book = bookRepository.findById(request.getBookId())
                    .orElseThrow(() -> new com.library.exception.ResourceNotFoundException("Book not found"));
            copy.setBook(book);
        }
        
        copy.setCopyCode(request.getCopyCode());
        copy.setStatus(request.getStatus());
        copy.setShelfLocation(request.getShelfLocation());
        
        return mapCopy(bookCopyRepository.save(copy));
    }

    @Override
    public void deleteCopy(Long id) {
        if (!bookCopyRepository.existsById(id)) {
            throw new com.library.exception.ResourceNotFoundException("Book copy not found");
        }
        // Need to check if there are loans for this copy, but DB foreign key restricts it anyway
        try {
            bookCopyRepository.deleteById(id);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            throw new com.library.exception.BusinessRuleException("Cannot delete copy because it is referenced in loans or reservations.");
        }
    }

    private BookCopyResponse mapCopy(BookCopy copy) {
        return BookCopyResponse.builder()
                .id(copy.getId())
                .copyCode(copy.getCopyCode())
                .bookTitle(copy.getBook().getTitle())
                .status(copy.getStatus().name())
                .shelfLocation(copy.getShelfLocation())
                .build();
    }
}
