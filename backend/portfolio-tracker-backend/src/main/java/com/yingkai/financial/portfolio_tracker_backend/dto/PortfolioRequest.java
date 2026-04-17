package com.yingkai.financial.portfolio_tracker_backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioRequest {
    private String name;
    private String allocations;
    private Integer userId;
}