package com.yingkai.financial.portfolio_tracker_backend.service;

import com.yingkai.financial.portfolio_tracker_backend.entity.Portfolio;
import com.yingkai.financial.portfolio_tracker_backend.repository.PortfolioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;

    public List<Portfolio> findByUserId(Integer userId) {
        return portfolioRepository.findByUserId(userId);
    }

    public Optional<Portfolio> findById(Integer id) {
        return portfolioRepository.findById(id);
    }

    public Portfolio save(Portfolio portfolio) {
        return portfolioRepository.save(portfolio);
    }

    public void deleteById(Integer id) {
        portfolioRepository.deleteById(id);
    }

    public void deleteAllByUserId(Integer userId) {
        List<Portfolio> portfolios = portfolioRepository.findByUserId(userId);
        portfolioRepository.deleteAll(portfolios);
    }
}
