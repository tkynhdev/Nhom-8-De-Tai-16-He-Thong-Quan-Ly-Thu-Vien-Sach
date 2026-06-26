package com.library.service.impl;

import com.library.entity.Book;
import com.library.entity.Reservation;
import com.library.entity.Member;
import com.library.enums.CopyStatus;
import com.library.enums.ReservationStatus;
import com.library.exception.BusinessRuleException;
import com.library.exception.ResourceNotFoundException;
import com.library.repository.BookCopyRepository;
import com.library.repository.BookRepository;
import com.library.repository.MemberRepository;
import com.library.repository.ReservationRepository;
import com.library.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Handles reservation rules and persistence.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;
    private final BookCopyRepository bookCopyRepository;

    @Override
    @Transactional
    public Reservation reserveBook(Long memberId, Long bookId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with ID: " + memberId));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + bookId));

        long availableCopies = bookCopyRepository.countByBook_IdAndStatus(bookId, CopyStatus.AVAILABLE);
        if (availableCopies > 0) {
            throw new BusinessRuleException("Book still has available copies. Borrow instead of reserving.");
        }

        reservationRepository.findFirstByBook_IdAndMember_IdAndStatus(bookId, memberId, ReservationStatus.PENDING)
                .ifPresent(existing -> {
                    throw new BusinessRuleException("Member already has a pending reservation for this book.");
                });

        Reservation reservation = Reservation.builder()
                .book(book)
                .member(member)
                .reservationDate(LocalDateTime.now())
                .status(ReservationStatus.PENDING)
                .build();

        return reservationRepository.save(reservation);
    }

    @Override
    public List<Reservation> getReservationsForMember(Long memberId) {
        return reservationRepository.findByMember_IdOrderByReservationDateDesc(memberId);
    }

    @Override
    @Transactional
    public Reservation cancelReservation(Long reservationId, Long memberId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with ID: " + reservationId));

        if (!reservation.getMember().getId().equals(memberId)) {
            throw new BusinessRuleException("Reservation does not belong to the authenticated member.");
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        return reservationRepository.save(reservation);
    }
}
