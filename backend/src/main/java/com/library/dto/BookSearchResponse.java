package com.library.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookSearchResponse {
    private Long id;
    private String isbn;
    private String title;
    private String author;
    private String category;
    private long availableCopies;
}
