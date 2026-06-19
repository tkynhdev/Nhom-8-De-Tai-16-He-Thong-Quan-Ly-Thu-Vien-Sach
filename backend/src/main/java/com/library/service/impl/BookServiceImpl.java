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

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final BookCopyRepository bookCopyRepository;

    @Override
    public Page<BookSearchResponse> searchBooks(String title, String author, String category, String isbn, Pageable pageable) {
        List<Book> books = bookRepository.searchBooks(title, author, category, isbn);
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), books.size());
        List<BookSearchResponse> content = books.subList(start, end).stream()
                .map(book -> BookSearchResponse.builder()
                        .id(book.getId())
                        .isbn(book.getIsbn())
                        .title(book.getTitle())
                        .author(book.getAuthor())
                        .category(book.getCategory())
                        .availableCopies(bookCopyRepository.countByBook_IdAndStatus(book.getId(), CopyStatus.AVAILABLE))
                        .build())
                .collect(Collectors.toList());
        return new PageImpl<>(content, pageable, books.size());
    }
}
