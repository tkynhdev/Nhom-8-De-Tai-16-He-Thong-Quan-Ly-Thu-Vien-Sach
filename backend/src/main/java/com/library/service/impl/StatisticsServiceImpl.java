package com.library.service.impl;

import com.library.dto.StatisticsOverviewResponse;
import com.library.enums.CopyStatus;
import com.library.enums.LoanStatus;
import com.library.repository.BookCopyRepository;
import com.library.repository.FineRepository;
import com.library.repository.LoanRepository;
import com.library.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Computes dashboard metrics from persisted library data.
 */
@Service
@RequiredArgsConstructor
public class StatisticsServiceImpl implements StatisticsService {

    private final LoanRepository loanRepository;
    private final BookCopyRepository bookCopyRepository;
    private final FineRepository fineRepository;

    @Override
    public StatisticsOverviewResponse getOverview() {
        LocalDateTime monthStart = LocalDateTime.now().withDayOfMonth(1).toLocalDate().atStartOfDay();
        LocalDateTime nextMonthStart = monthStart.plusMonths(1);

        BigDecimal monthlyFinesCollected = fineRepository.sumAmounts(
                fineRepository.findByCreatedAtBetween(monthStart, nextMonthStart));

        return StatisticsOverviewResponse.builder()
                .totalActiveLoans(loanRepository.countByStatus(LoanStatus.ACTIVE))
                .totalOverdue(loanRepository.findOverdueUnreturnedLoans().size())
                .availableCopies(bookCopyRepository.countByStatus(CopyStatus.AVAILABLE))
                .monthlyFinesCollected(monthlyFinesCollected)
                .popularBooks(loanRepository.findPopularBooks(PageRequest.of(0, 5)))
                .topMembers(loanRepository.findTopMembers(PageRequest.of(0, 5)))
                .build();
    }
}
