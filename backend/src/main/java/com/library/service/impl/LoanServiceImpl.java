package com.library.service.impl;

import com.library.entity.BookCopy;
import com.library.entity.Fine;
import com.library.entity.Loan;
import com.library.entity.Member;
import com.library.entity.Reservation;
import com.library.enums.CopyStatus;
import com.library.enums.FineStatus;
import com.library.enums.LoanStatus;
import com.library.enums.ReservationStatus;
import com.library.event.BookReturnedEvent;
import com.library.exception.BookNotAvailableException;
import com.library.exception.BusinessRuleException;
import com.library.exception.ResourceNotFoundException;
import com.library.repository.BookCopyRepository;
import com.library.repository.FineRepository;
import com.library.repository.LoanRepository;
import com.library.repository.MemberRepository;
import com.library.repository.ReservationRepository;
import com.library.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LoanServiceImpl implements LoanService {

    private final LoanRepository loanRepository;
    private final BookCopyRepository bookCopyRepository;
    private final MemberRepository memberRepository;
    private final ReservationRepository reservationRepository;
    private final FineRepository fineRepository;
    private final ApplicationEventPublisher eventPublisher;

    private static final int MAX_RENEWAL_COUNT = 2;
    private static final int LOAN_DAYS_LIMIT = 14;
    private static final BigDecimal FINE_RATE_PER_DAY = new BigDecimal("5000.00");

    @Override
    @Transactional
    public Loan borrowBook(Long memberId, Long bookId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with ID: " + memberId));

        BookCopy availableCopy = bookCopyRepository.findFirstByBook_IdAndStatus(bookId, CopyStatus.AVAILABLE)
                .orElseThrow(() -> new BookNotAvailableException("No available copies for book ID: " + bookId));

        availableCopy.setStatus(CopyStatus.LOANED);
        bookCopyRepository.save(availableCopy);

        LocalDateTime now = LocalDateTime.now();
        Loan newLoan = Loan.builder()
                .member(member)
                .bookCopy(availableCopy)
                .loanDate(now)
                .dueDate(now.plusDays(LOAN_DAYS_LIMIT))
                .status(LoanStatus.ACTIVE)
                .renewalCount(0)
                .build();

        return loanRepository.save(newLoan);
    }

    @Override
    @Transactional
    public Loan returnBook(Long loanId) {
        Loan loan = loanRepository.findByIdWithDetails(loanId)
                .orElseThrow(() -> new ResourceNotFoundException("Loan not found with ID: " + loanId));

        if (loan.getStatus() == LoanStatus.RETURNED) {
            throw new BusinessRuleException("This loan is already returned.");
        }

        LocalDateTime returnDate = LocalDateTime.now();
        loan.setReturnDate(returnDate);
        loan.setStatus(LoanStatus.RETURNED);

        if (returnDate.isAfter(loan.getDueDate())) {
            long overdueDays = ChronoUnit.DAYS.between(loan.getDueDate(), returnDate);
            if (overdueDays > 0) {
                Fine fine = Fine.builder()
                        .loan(loan)
                        .amount(FINE_RATE_PER_DAY.multiply(new BigDecimal(overdueDays)))
                        .reason("Overdue for " + overdueDays + " days")
                        .status(FineStatus.UNPAID)
                        .build();
                fineRepository.save(fine);
            }
        }

        BookCopy bookCopy = loan.getBookCopy();
        bookCopy.setStatus(CopyStatus.AVAILABLE);
        bookCopyRepository.save(bookCopy);
        loanRepository.save(loan);

        Long bookId = bookCopy.getBook().getId();
        List<Reservation> pendingReservations = reservationRepository
                .findByBook_IdAndStatusOrderByReservationDateAsc(bookId, ReservationStatus.PENDING);

        if (!pendingReservations.isEmpty()) {
            eventPublisher.publishEvent(new BookReturnedEvent(this, bookId, bookCopy.getId()));
        }

        return loan;
    }

    @Override
    @Transactional
    public Loan renewBook(Long loanId) {
        Loan loan = loanRepository.findByIdWithDetails(loanId)
                .orElseThrow(() -> new ResourceNotFoundException("Loan not found with ID: " + loanId));

        if (loan.getStatus() != LoanStatus.ACTIVE) {
            throw new BusinessRuleException("Only active loans can be renewed.");
        }

        if (loan.getRenewalCount() >= MAX_RENEWAL_COUNT) {
            throw new BusinessRuleException("Maximum renewal limit reached (" + MAX_RENEWAL_COUNT + " times).");
        }

        Long bookId = loan.getBookCopy().getBook().getId();
        List<Reservation> pendingReservations = reservationRepository
                .findByBook_IdAndStatusOrderByReservationDateAsc(bookId, ReservationStatus.PENDING);

        if (!pendingReservations.isEmpty()) {
            throw new BusinessRuleException("Cannot renew book. There are pending reservations for this book.");
        }

        loan.setDueDate(loan.getDueDate().plusDays(LOAN_DAYS_LIMIT));
        loan.setRenewalCount(loan.getRenewalCount() + 1);

        return loanRepository.save(loan);
    }
}
