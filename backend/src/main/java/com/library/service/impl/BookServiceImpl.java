package com.library.service.impl;

import com.library.dto.BookSearchResponse;
import com.library.entity.Book;
import com.library.enums.CopyStatus;
import com.library.repository.BookCopyRepository;
import com.library.repository.BookRepository;
import com.library.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Searches books and enriches each result with available-copy counts.
 */
@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final BookCopyRepository bookCopyRepository;

    @Override
    public Page<BookSearchResponse> searchBooks(String keyword, String category, Pageable pageable) {
        keyword = keyword == null ? "" : keyword;
        category = category == null ? "" : category;
        List<Book> books = bookRepository.searchBooksByKeyword(keyword, category);
        int start = (int) pageable.getOffset();
        if (start >= books.size()) {
            return new PageImpl<>(List.of(), pageable, books.size());
        }
        int end = Math.min(start + pageable.getPageSize(), books.size());
        List<BookSearchResponse> content = books.subList(start, end).stream()
                .map(book -> BookSearchResponse.builder()
                        .id(book.getId())
                        .isbn(book.getIsbn())
                        .title(book.getTitle())
                        .author(book.getAuthor())
                        .category(book.getCategory())
                        .coverUrl(book.getCoverUrl())
                        .availableCopies(bookCopyRepository.countByBook_IdAndStatus(book.getId(), CopyStatus.AVAILABLE))
                        .build())
                .collect(Collectors.toList());
        return new PageImpl<>(content, pageable, books.size());
    }

    @Override
    public BookSearchResponse createBook(com.library.dto.BookRequest request) {
        if (bookRepository.findByIsbn(request.getIsbn()).isPresent()) {
            throw new com.library.exception.BusinessRuleException("ISBN already exists");
        }
        
        Book book = Book.builder()
                .isbn(request.getIsbn())
                .title(request.getTitle())
                .author(request.getAuthor())
                .category(request.getCategory())
                .publisher(request.getPublisher())
                .description(request.getDescription())
                .coverUrl(request.getCoverUrl())
                .build();
                
        book = bookRepository.save(book);
        
        return BookSearchResponse.builder()
                .id(book.getId())
                .isbn(book.getIsbn())
                .title(book.getTitle())
                .author(book.getAuthor())
                .category(book.getCategory())
                .coverUrl(book.getCoverUrl())
                .availableCopies(0L)
                .build();
    }

    @Override
    public BookSearchResponse updateBook(Long id, com.library.dto.BookRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new com.library.exception.ResourceNotFoundException("Book not found"));
                
        // Check ISBN uniqueness if changed
        if (!book.getIsbn().equals(request.getIsbn()) && 
            bookRepository.findByIsbn(request.getIsbn()).isPresent()) {
            throw new com.library.exception.BusinessRuleException("ISBN already exists");
        }
        
        book.setIsbn(request.getIsbn());
        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setCategory(request.getCategory());
        book.setPublisher(request.getPublisher());
        book.setDescription(request.getDescription());
        book.setCoverUrl(request.getCoverUrl());
        
        book = bookRepository.save(book);
        
        return BookSearchResponse.builder()
                .id(book.getId())
                .isbn(book.getIsbn())
                .title(book.getTitle())
                .author(book.getAuthor())
                .category(book.getCategory())
                .coverUrl(book.getCoverUrl())
                .availableCopies(bookCopyRepository.countByBook_IdAndStatus(book.getId(), CopyStatus.AVAILABLE))
                .build();
    }

    @Override
    public void deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new com.library.exception.ResourceNotFoundException("Book not found");
        }
        bookRepository.deleteById(id);
    }
}
