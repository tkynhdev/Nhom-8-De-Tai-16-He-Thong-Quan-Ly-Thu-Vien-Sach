package com.library.repository;

import com.library.entity.Reservation;
import com.library.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByBook_IdAndStatusOrderByReservationDateAsc(Long bookId, ReservationStatus status);

    @Query("SELECT r FROM Reservation r " +
            "JOIN FETCH r.book b " +
            "JOIN FETCH r.member m " +
            "WHERE m.id = :memberId " +
            "ORDER BY r.reservationDate DESC")
    List<Reservation> findByMember_IdOrderByReservationDateDesc(@Param("memberId") Long memberId);

    Optional<Reservation> findFirstByBook_IdAndMember_IdAndStatus(Long bookId, Long memberId, ReservationStatus status);

    long countByStatus(ReservationStatus status);
}
