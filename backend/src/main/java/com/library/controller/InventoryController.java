package com.library.controller;

import com.library.dto.BookCopyResponse;
import com.library.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Admin and librarian inventory API.
 */
@RestController
@RequestMapping("/api/v1/admin/book-copies")
@RequiredArgsConstructor
@Tag(name = "Inventory", description = "API for managing physical book copies")
@SecurityRequirement(name = "bearerAuth")
public class InventoryController {

    private final InventoryService inventoryService;

    /**
     * Returns the complete list of physical copies.
     */
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    @GetMapping
    public ResponseEntity<List<BookCopyResponse>> getAllCopies() {
        return ResponseEntity.ok(inventoryService.getAllCopies());
    }
}
