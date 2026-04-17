package com.yingkai.financial.portfolio_tracker_backend.repository;

import com.yingkai.financial.portfolio_tracker_backend.entity.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Integer> {
    List<Portfolio> findByUserId(Integer userId);
}