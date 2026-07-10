package com.library.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookRequest {
    @NotBlank
    private String isbn;
    
    @NotBlank
    private String title;
    
    @NotBlank
    private String author;
    
    @NotBlank
    private String category;
    
    private String publisher;
    private String description;
    private String coverUrl;
}
