package com.yingkai.financial.portfolio_tracker_backend.repository;

import com.yingkai.financial.portfolio_tracker_backend.entity.FundPerformance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FundPerformanceRepository extends JpaRepository<FundPerformance, Integer> {
    Optional<FundPerformance> findByTicker(String ticker);
}