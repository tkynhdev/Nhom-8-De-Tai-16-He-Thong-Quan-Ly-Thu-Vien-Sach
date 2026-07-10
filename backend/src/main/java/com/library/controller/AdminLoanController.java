package com.library.controller;

import com.library.dto.AdminBorrowRequest;
import com.library.dto.LoanResponse;
import com.library.entity.Loan;
import com.library.service.LoanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/loans")
@RequiredArgsConstructor
@Tag(name = "Admin Loans", description = "Admin API for managing loans")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
public class AdminLoanController {

    private final LoanService loanService;

    @Operation(summary = "Get active loans")
    @GetMapping("/active")
    public ResponseEntity<List<LoanResponse>> getActiveLoans() {
        return ResponseEntity.ok(
                loanService.getActiveLoans().stream()
                        .map(this::mapToResponse)
                        .toList());
    }

    @Operation(summary = "Get overdue loans")
    @GetMapping("/overdue")
    public ResponseEntity<List<LoanResponse>> getOverdueLoans() {
        return ResponseEntity.ok(
                loanService.getOverdueLoans().stream()
                        .map(this::mapToResponse)
                        .toList());
    }

    @Operation(summary = "Borrow book for member")
    @PostMapping("/borrow")
    public ResponseEntity<LoanResponse> borrowBook(@Valid @RequestBody AdminBorrowRequest request) {
        Loan loan = loanService.adminBorrowBook(request.getMemberCode(), request.getCopyCode());
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(loan));
    }

    @Operation(summary = "Return book by copy code")
    @PostMapping("/return")
    public ResponseEntity<LoanResponse> returnBook(@RequestParam String copyCode) {
        Loan loan = loanService.adminReturnBook(copyCode);
        return ResponseEntity.ok(mapToResponse(loan));
    }

    @Operation(summary = "Return book by loan ID")
    @PostMapping("/{loanId}/return")
    public ResponseEntity<LoanResponse> returnBookById(@PathVariable Long loanId) {
        Loan loan = loanService.returnBook(loanId);
        return ResponseEntity.ok(mapToResponse(loan));
    }

    private LoanResponse mapToResponse(Loan loan) {
        Long overdueDays = null;
        BigDecimal fineAmount = null;
        if (loan.getDueDate() != null) {
            LocalDateTime comparisonDate = loan.getReturnDate() == null ? LocalDateTime.now() : loan.getReturnDate();
            long daysLate = ChronoUnit.DAYS.between(loan.getDueDate(), comparisonDate);
            if (daysLate > 0) {
                overdueDays = daysLate;
                fineAmount = BigDecimal.valueOf(daysLate).multiply(new BigDecimal("5000.00"));
            }
        }

        return LoanResponse.builder()
                .id(loan.getId())
                .bookCopyId(loan.getBookCopy().getId())
                .bookTitle(loan.getBookCopy().getBook().getTitle())
                .memberCode(loan.getMember().getMemberCode())
                .loanDate(loan.getLoanDate())
                .dueDate(loan.getDueDate())
                .returnDate(loan.getReturnDate())
                .status(loan.getStatus().name())
                .renewalCount(loan.getRenewalCount())
                .overdueDays(overdueDays)
                .fineAmount(fineAmount)
                .build();
    }
}
