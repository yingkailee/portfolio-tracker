package com.yingkai.financial.portfolio_tracker_backend.repository;

import com.yingkai.financial.portfolio_tracker_backend.entity.Fund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FundRepository extends JpaRepository<Fund, Long> {
    Optional<Fund> findByTicker(String ticker);
}
