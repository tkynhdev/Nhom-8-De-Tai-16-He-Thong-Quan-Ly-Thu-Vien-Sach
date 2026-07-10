package com.library.service;

import com.library.entity.Loan;

import java.util.List;

public interface LoanService {

    Loan borrowBook(Long memberId, Long bookId);

    Loan adminBorrowBook(String memberCode, String copyCode);

    Loan returnBook(Long loanId);

    Loan adminReturnBook(String copyCode);

    Loan renewBook(Long loanId);

    List<Loan> getLoansForMember(Long memberId);

    List<Loan> getActiveLoans();

    List<Loan> getOverdueLoans();
}
