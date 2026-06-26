package com.library.repository;

import com.library.entity.Loan;
import com.library.enums.LoanStatus;
import com.library.dto.MemberActivityResponse;
import com.library.dto.PopularBookResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
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
           "WHERE l.status = com.library.enums.LoanStatus.ACTIVE AND l.dueDate < CURRENT_TIMESTAMP")
    List<Loan> findOverdueUnreturnedLoans();

    @Query("SELECT DISTINCT l FROM Loan l " +
            "JOIN FETCH l.bookCopy bc " +
            "JOIN FETCH bc.book " +
            "JOIN FETCH l.member " +
            "WHERE l.member.id = :memberId " +
            "ORDER BY l.loanDate DESC")
    List<Loan> findByMember_IdOrderByLoanDateDesc(@Param("memberId") Long memberId);

    long countByStatus(LoanStatus status);

    @Query("SELECT new com.library.dto.PopularBookResponse(b.title, COUNT(l)) " +
            "FROM Loan l JOIN l.bookCopy bc JOIN bc.book b " +
            "GROUP BY b.title " +
            "ORDER BY COUNT(l) DESC")
    List<PopularBookResponse> findPopularBooks(Pageable pageable);

    @Query("SELECT new com.library.dto.MemberActivityResponse(m.memberCode, m.fullName, COUNT(l)) " +
            "FROM Loan l JOIN l.member m " +
            "GROUP BY m.memberCode, m.fullName " +
            "ORDER BY COUNT(l) DESC")
    List<MemberActivityResponse> findTopMembers(Pageable pageable);
}
