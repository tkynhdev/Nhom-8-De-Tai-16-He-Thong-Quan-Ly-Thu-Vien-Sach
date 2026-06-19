package com.library.service;

import com.library.entity.Loan;

public interface LoanService {

    Loan borrowBook(Long memberId, Long bookId);

    Loan returnBook(Long loanId);

    Loan renewBook(Long loanId);
}
