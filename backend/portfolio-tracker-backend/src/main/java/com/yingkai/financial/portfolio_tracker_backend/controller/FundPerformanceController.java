package com.yingkai.financial.portfolio_tracker_backend.controller;

import com.yingkai.financial.portfolio_tracker_backend.entity.FundPerformance;
import com.yingkai.financial.portfolio_tracker_backend.service.YahooFinanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fund-performance")
@CrossOrigin(origins = "*")
public class FundPerformanceController {

    private final YahooFinanceService yahooFinanceService;

    @Autowired
    public FundPerformanceController(YahooFinanceService yahooFinanceService) {
        this.yahooFinanceService = yahooFinanceService;
    }

    @GetMapping("/{ticker}")
    public ResponseEntity<FundPerformance> getCAGR(@PathVariable String ticker) {
        try {
            FundPerformance performance = yahooFinanceService.getOrFetchCAGR(ticker);
            return ResponseEntity.ok(performance);
        } catch (Exception e) {
            System.err.println("Error fetching CAGR for " + ticker + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .build();
        }
    }

    @PostMapping("/{ticker}/refresh")
    public ResponseEntity<FundPerformance> refreshCAGR(@PathVariable String ticker) {
        try {
            FundPerformance performance = yahooFinanceService.fetchAndStoreCAGR(ticker);
            return ResponseEntity.ok(performance);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .build();
        }
    }
}