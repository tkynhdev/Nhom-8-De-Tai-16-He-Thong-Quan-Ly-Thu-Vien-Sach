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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Admin and librarian inventory API.
 */
@RestController
@RequestMapping("/api/v1/admin/copies")
@RequiredArgsConstructor
@Tag(name = "Inventory", description = "API for managing physical book copies")
@SecurityRequirement(name = "bearerAuth")
public class InventoryController {

    private final InventoryService inventoryService;

    @Operation(summary = "Returns the complete list of physical copies")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    @GetMapping
    public ResponseEntity<List<BookCopyResponse>> getAllCopies() {
        return ResponseEntity.ok(inventoryService.getAllCopies());
    }

    @Operation(summary = "Create a book copy")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    @PostMapping
    public ResponseEntity<BookCopyResponse> createCopy(@jakarta.validation.Valid @org.springframework.web.bind.annotation.RequestBody com.library.dto.BookCopyRequest request) {
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED).body(inventoryService.createCopy(request));
    }

    @Operation(summary = "Update a book copy")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<BookCopyResponse> updateCopy(@org.springframework.web.bind.annotation.PathVariable Long id, @jakarta.validation.Valid @org.springframework.web.bind.annotation.RequestBody com.library.dto.BookCopyRequest request) {
        return ResponseEntity.ok(inventoryService.updateCopy(id, request));
    }

    @Operation(summary = "Delete a book copy")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCopy(@org.springframework.web.bind.annotation.PathVariable Long id) {
        inventoryService.deleteCopy(id);
        return ResponseEntity.noContent().build();
    }
}
