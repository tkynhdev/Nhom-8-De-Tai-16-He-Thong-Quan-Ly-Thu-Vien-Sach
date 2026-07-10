package com.library.controller;

import com.library.dto.BookSearchResponse;
import com.library.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Exposes public book-search endpoints with pagination and filters.
 */
@RestController
@RequestMapping("/api/v1/books")
@RequiredArgsConstructor
@Tag(name = "Books", description = "API for searching and viewing books")
public class BookController {

    private final BookService bookService;

    @Operation(summary = "Search books", description = "Search books by title, author, category, or ISBN with pagination")
    @GetMapping("/search")
    public ResponseEntity<Page<BookSearchResponse>> searchBooks(
            @Parameter(description = "Book Title") @RequestParam(required = false) String title,
            @Parameter(description = "Author Name") @RequestParam(required = false) String author,
            @Parameter(description = "Category") @RequestParam(required = false) String category,
            @Parameter(description = "ISBN Code") @RequestParam(required = false) String isbn,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size) {

        Page<BookSearchResponse> result = bookService.searchBooks(title, author, category, isbn, PageRequest.of(page, size));
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Create a book")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
    @org.springframework.web.bind.annotation.PostMapping
    public ResponseEntity<BookSearchResponse> createBook(@jakarta.validation.Valid @org.springframework.web.bind.annotation.RequestBody com.library.dto.BookRequest request) {
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED).body(bookService.createBook(request));
    }

    @Operation(summary = "Update a book")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
    @org.springframework.web.bind.annotation.PutMapping("/{id}")
    public ResponseEntity<BookSearchResponse> updateBook(@org.springframework.web.bind.annotation.PathVariable Long id, @jakarta.validation.Valid @org.springframework.web.bind.annotation.RequestBody com.library.dto.BookRequest request) {
        return ResponseEntity.ok(bookService.updateBook(id, request));
    }

    @Operation(summary = "Delete a book")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
    @org.springframework.web.bind.annotation.DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@org.springframework.web.bind.annotation.PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }
}
