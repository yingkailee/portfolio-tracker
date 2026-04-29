package com.yingkai.financial.portfolio_tracker_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.sql.Timestamp;
import java.time.LocalDate;

@Entity
@Table(name = "fund_performance")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FundPerformance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String ticker;

    private Double cagr5yr;
    private Double cagr10yr;
    private Double cagr15yr;

    @Column(columnDefinition = "TEXT")
    private String monthlyReturns;

    private Double vol5yr;
    private Double vol10yr;
    private Double vol15yr;

    private LocalDate dataStartDate;
    private LocalDate dataEndDate;

    private Timestamp calculatedAt;
    private Timestamp expiresAt;
}