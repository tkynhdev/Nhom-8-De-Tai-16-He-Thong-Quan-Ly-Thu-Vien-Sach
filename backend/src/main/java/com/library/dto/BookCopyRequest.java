package com.library.dto;

import com.library.enums.CopyStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookCopyRequest {
    
    @NotNull
    private Long bookId;
    
    @NotBlank
    private String copyCode;
    
    @NotNull
    private CopyStatus status;
    
    private String shelfLocation;
}
