package com.yingkai.financial.portfolio_tracker_backend.service;

import com.yingkai.financial.portfolio_tracker_backend.dto.CalculationRequest;
import com.yingkai.financial.portfolio_tracker_backend.dto.CalculationResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CalculationService {

    public CalculationResponse calculateProjection(CalculationRequest request) {
        double netWorth = request.getInitialCapital();
        double yearlySavings = request.getYearlySavings();
        int years = request.getTimeHorizonYears();
        double annualYield = request.getPortfolioYield() / 100.0;
        double totalInvested = netWorth;

        for (int i = 0; i < years; i++) {
            netWorth = (netWorth + yearlySavings) * (1 + annualYield);
            totalInvested += yearlySavings;
        }

        return new CalculationResponse(
                request.getInitialCapital(),
                request.getYearlySavings(),
                years,
                request.getPortfolioYield(),
                Math.round(netWorth * 100.0) / 100.0,
                Math.round(totalInvested * 100.0) / 100.0,
                Math.round((netWorth - totalInvested) * 100.0) / 100.0
        );
    }

    public double calculatePortfolioYield(Map<String, Double> allocations, Map<String, Double> fundYields) {
        return allocations.entrySet().stream()
                .mapToDouble(e -> e.getValue() * fundYields.getOrDefault(e.getKey(), 0.0))
                .sum();
    }
}
