package com.library.repository;

import com.library.entity.Fine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FineRepository extends JpaRepository<Fine, Long> {

    List<Fine> findByLoan_Member_Id(Long memberId);

    List<Fine> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    default BigDecimal sumAmounts(List<Fine> fines) {
        return fines.stream()
                .map(Fine::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
