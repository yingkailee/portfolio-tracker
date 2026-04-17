package com.yingkai.financial.portfolio_tracker_backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioAllocationRequest {
    private java.util.Map<String, Double> allocations;
}
