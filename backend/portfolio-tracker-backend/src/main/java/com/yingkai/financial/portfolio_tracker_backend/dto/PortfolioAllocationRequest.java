package com.yingkai.financial.portfolio_tracker_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioAllocationRequest {
    private java.util.Map<String, Double> allocations;
}
