package com.library.controller;

import com.library.dto.BorrowRequest;
import com.library.dto.LoanResponse;
import com.library.security.MemberPrincipal;
import com.library.entity.Loan;
import com.library.service.LoanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/loans")
@RequiredArgsConstructor
@Tag(name = "Loans", description = "API for borrowing, returning, and renewing books")
@SecurityRequirement(name = "bearerAuth")
public class LoanController {

    private final LoanService loanService;

    @Operation(summary = "Borrow a book", description = "Creates a new loan record for the authenticated member")
    @PostMapping("/borrow")
    public ResponseEntity<LoanResponse> borrowBook(
            @Valid @RequestBody BorrowRequest request,
            Authentication authentication) {

        MemberPrincipal principal = (MemberPrincipal) authentication.getPrincipal();
        Long memberId = principal.getId();

        Loan loan = loanService.borrowBook(memberId, request.getBookId());
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(loan));
    }

    @Operation(summary = "Return a book", description = "Marks a loan as returned and calculates any overdue fines")
    @PostMapping("/{loanId}/return")
    public ResponseEntity<LoanResponse> returnBook(@PathVariable Long loanId) {
        Loan loan = loanService.returnBook(loanId);
        return ResponseEntity.ok(mapToResponse(loan));
    }

    @Operation(summary = "Renew a book", description = "Extends the due date of an active loan if rules allow")
    @PostMapping("/{loanId}/renew")
    public ResponseEntity<LoanResponse> renewBook(@PathVariable Long loanId) {
        Loan loan = loanService.renewBook(loanId);
        return ResponseEntity.ok(mapToResponse(loan));
    }

    private LoanResponse mapToResponse(Loan loan) {
        return LoanResponse.builder()
                .id(loan.getId())
                .bookCopyId(loan.getBookCopy().getId())
                .bookTitle(loan.getBookCopy().getBook().getTitle())
                .loanDate(loan.getLoanDate())
                .dueDate(loan.getDueDate())
                .returnDate(loan.getReturnDate())
                .status(loan.getStatus().name())
                .renewalCount(loan.getRenewalCount())
                .build();
    }
}
