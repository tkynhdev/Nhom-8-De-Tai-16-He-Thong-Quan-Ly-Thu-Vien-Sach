package com.library.service;

import com.library.entity.*;
import com.library.enums.*;
import com.library.exception.BookNotAvailableException;
import com.library.exception.BusinessRuleException;
import com.library.repository.*;
import com.library.service.impl.LoanServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class LoanServiceTest {

    @Mock
    private LoanRepository loanRepository;
    @Mock
    private BookCopyRepository bookCopyRepository;
    @Mock
    private MemberRepository memberRepository;
    @Mock
    private ReservationRepository reservationRepository;
    @Mock
    private FineRepository fineRepository;
    @Mock
    private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private LoanServiceImpl loanService;

    private Member testMember;
    private Book testBook;
    private BookCopy testBookCopy;
    private Loan testLoan;

    @BeforeEach
    void setUp() {
        testMember = Member.builder().id(1L).memberCode("M001").build();
        testBook = Book.builder().id(100L).title("Spring Boot in Action").build();
        testBookCopy = BookCopy.builder().id(200L).book(testBook).copyCode("C001").status(CopyStatus.AVAILABLE).build();

        testLoan = Loan.builder()
                .id(300L)
                .member(testMember)
                .bookCopy(testBookCopy)
                .loanDate(LocalDateTime.now().minusDays(5))
                .dueDate(LocalDateTime.now().plusDays(9))
                .status(LoanStatus.ACTIVE)
                .renewalCount(0)
                .build();
    }

    @Test
    @DisplayName("1. Thành công: Tạo phiếu mượn khi còn bản sao")
    void testBorrowBook_Success() {
        when(memberRepository.findById(1L)).thenReturn(Optional.of(testMember));
        when(bookCopyRepository.findFirstByBook_IdAndStatus(100L, CopyStatus.AVAILABLE))
                .thenReturn(Optional.of(testBookCopy));
        when(loanRepository.save(any(Loan.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Loan createdLoan = loanService.borrowBook(1L, 100L);

        assertNotNull(createdLoan);
        assertEquals(LoanStatus.ACTIVE, createdLoan.getStatus());
        assertEquals(CopyStatus.LOANED, testBookCopy.getStatus());
        verify(bookCopyRepository, times(1)).save(testBookCopy);
        verify(loanRepository, times(1)).save(any(Loan.class));
    }

    @Test
    @DisplayName("2. Thất bại: Mượn sách khi đã hết bản sao (bắn Exception)")
    void testBorrowBook_Fail_NoCopies() {
        when(memberRepository.findById(1L)).thenReturn(Optional.of(testMember));
        when(bookCopyRepository.findFirstByBook_IdAndStatus(100L, CopyStatus.AVAILABLE))
                .thenReturn(Optional.empty());

        assertThrows(BookNotAvailableException.class, () -> loanService.borrowBook(1L, 100L));
        verify(loanRepository, never()).save(any(Loan.class));
    }

    @Test
    @DisplayName("3. Thành công: Trả sách đúng hạn (không phát sinh Fine)")
    void testReturnBook_Success_OnTime() {
        when(loanRepository.findByIdWithDetails(300L)).thenReturn(Optional.of(testLoan));
        when(reservationRepository.findByBook_IdAndStatusOrderByReservationDateAsc(100L, ReservationStatus.PENDING))
                .thenReturn(Collections.emptyList());

        Loan returnedLoan = loanService.returnBook(300L);

        assertEquals(LoanStatus.RETURNED, returnedLoan.getStatus());
        assertNotNull(returnedLoan.getReturnDate());
        assertEquals(CopyStatus.AVAILABLE, testBookCopy.getStatus());
        verify(fineRepository, never()).save(any(Fine.class));
    }

    @Test
    @DisplayName("4. Thành công: Trả sách trễ hạn (phát sinh bảng Fine với số tiền chính xác)")
    void testReturnBook_Success_Overdue() {
        testLoan.setDueDate(LocalDateTime.now().minusDays(5));
        when(loanRepository.findByIdWithDetails(300L)).thenReturn(Optional.of(testLoan));
        when(reservationRepository.findByBook_IdAndStatusOrderByReservationDateAsc(100L, ReservationStatus.PENDING))
                .thenReturn(Collections.emptyList());

        loanService.returnBook(300L);

        ArgumentCaptor<Fine> fineCaptor = ArgumentCaptor.forClass(Fine.class);
        verify(fineRepository, times(1)).save(fineCaptor.capture());

        Fine generatedFine = fineCaptor.getValue();
        assertEquals(0, generatedFine.getAmount().compareTo(new BigDecimal("25000.00")));
        assertEquals(FineStatus.UNPAID, generatedFine.getStatus());
        assertEquals(LoanStatus.RETURNED, testLoan.getStatus());
    }

    @Test
    @DisplayName("5. Thất bại: Gia hạn quá số lần quy định")
    void testRenewBook_Fail_MaxRenewalsReached() {
        testLoan.setRenewalCount(2);
        when(loanRepository.findByIdWithDetails(300L)).thenReturn(Optional.of(testLoan));

        BusinessRuleException exception = assertThrows(BusinessRuleException.class, () -> loanService.renewBook(300L));
        assertTrue(exception.getMessage().contains("Maximum renewal limit reached"));
        verify(loanRepository, never()).save(testLoan);
    }

    @Test
    @DisplayName("6. Thất bại: Gia hạn sách đang có người khác đặt chỗ (Reservation)")
    void testRenewBook_Fail_HasPendingReservation() {
        when(loanRepository.findByIdWithDetails(300L)).thenReturn(Optional.of(testLoan));
        Reservation pendingRes = Reservation.builder().id(1L).status(ReservationStatus.PENDING).build();
        when(reservationRepository.findByBook_IdAndStatusOrderByReservationDateAsc(100L, ReservationStatus.PENDING))
                .thenReturn(List.of(pendingRes));

        BusinessRuleException exception = assertThrows(BusinessRuleException.class, () -> loanService.renewBook(300L));
        assertTrue(exception.getMessage().contains("pending reservations for this book"));
    }
}
