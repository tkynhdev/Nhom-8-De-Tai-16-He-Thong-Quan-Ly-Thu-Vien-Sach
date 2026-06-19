package com.library.service;

import com.library.dto.BookSearchResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BookService {

    Page<BookSearchResponse> searchBooks(String title, String author, String category, String isbn, Pageable pageable);
}
