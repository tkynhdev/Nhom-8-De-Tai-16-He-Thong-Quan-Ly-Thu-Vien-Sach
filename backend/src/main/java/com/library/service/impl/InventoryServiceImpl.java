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

    @Override
    public List<BookCopyResponse> getAllCopies() {
        return bookCopyRepository.findAllWithBookOrderByUpdatedAtDesc()
                .stream()
                .map(this::mapCopy)
                .toList();
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
