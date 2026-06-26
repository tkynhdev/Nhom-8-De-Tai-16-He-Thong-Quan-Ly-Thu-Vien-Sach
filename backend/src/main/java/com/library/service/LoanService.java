package com.library.service;

import com.library.entity.Loan;

import java.util.List;

public interface LoanService {

    Loan borrowBook(Long memberId, Long bookId);

    Loan returnBook(Long loanId);

    Loan renewBook(Long loanId);

    List<Loan> getLoansForMember(Long memberId);

    List<Loan> getOverdueLoans();
}
