package com.library.repository;

import com.library.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {

    @Query("SELECT l FROM Loan l " +
           "JOIN FETCH l.bookCopy bc " +
           "JOIN FETCH bc.book " +
           "JOIN FETCH l.member " +
           "WHERE l.id = :id")
    Optional<Loan> findByIdWithDetails(@Param("id") Long id);

    @Query("SELECT l FROM Loan l " +
           "JOIN FETCH l.bookCopy bc " +
           "JOIN FETCH bc.book " +
           "JOIN FETCH l.member " +
           "WHERE l.status = 'ACTIVE' AND l.dueDate < CURRENT_TIMESTAMP")
    List<Loan> findOverdueUnreturnedLoans();
}
