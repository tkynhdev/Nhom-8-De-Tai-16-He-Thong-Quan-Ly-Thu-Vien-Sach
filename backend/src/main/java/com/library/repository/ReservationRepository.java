package com.library.repository;

import com.library.entity.Reservation;
import com.library.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByBook_IdAndStatusOrderByReservationDateAsc(Long bookId, ReservationStatus status);
}
