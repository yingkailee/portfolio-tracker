package com.yingkai.financial.portfolio_tracker_backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CalculationRequest {
    private Double initialCapital;
    private Double yearlySavings;
    private Integer timeHorizonYears;
    private Double portfolioYield;
}
