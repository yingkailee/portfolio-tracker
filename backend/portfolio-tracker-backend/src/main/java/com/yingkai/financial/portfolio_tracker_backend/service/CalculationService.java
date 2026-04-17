package com.yingkai.financial.portfolio_tracker_backend.service;

import com.yingkai.financial.portfolio_tracker_backend.dto.CalculationRequest;
import com.yingkai.financial.portfolio_tracker_backend.dto.CalculationResponse;
import org.springframework.stereotype.Service;

@Service
public class CalculationService {

    public CalculationResponse calculateProjection(CalculationRequest request) {
        double currentNetWorth = request.getCurrentNetWorth();
        double yearlySavings = request.getYearlySavings();
        int years = request.getTimeHorizonYears();
        double annualYield = request.getPortfolioYield() / 100.0;

        double finalNetWorth = currentNetWorth;
        double totalContributions = currentNetWorth;

        for (int i = 0; i < years; i++) {
            finalNetWorth = (finalNetWorth + yearlySavings) * (1 + annualYield);
            totalContributions += yearlySavings;
        }

        double totalGrowth = finalNetWorth - totalContributions;

        return new CalculationResponse(
                currentNetWorth,
                yearlySavings,
                years,
                request.getPortfolioYield(),
                Math.round(finalNetWorth * 100.0) / 100.0,
                Math.round(totalContributions * 100.0) / 100.0,
                Math.round(totalGrowth * 100.0) / 100.0
        );
    }

    public double calculatePortfolioYield(java.util.Map<String, Double> allocations, java.util.Map<String, Double> fundYields) {
        return allocations.entrySet().stream()
                .mapToDouble(e -> e.getValue() * fundYields.getOrDefault(e.getKey(), 0.0))
                .sum();
    }
}
