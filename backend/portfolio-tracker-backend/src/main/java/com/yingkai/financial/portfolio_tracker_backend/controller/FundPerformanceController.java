package com.yingkai.financial.portfolio_tracker_backend.controller;

import com.yingkai.financial.portfolio_tracker_backend.entity.FundPerformance;
import com.yingkai.financial.portfolio_tracker_backend.service.YahooFinanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fund-performance")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FundPerformanceController {

    private final YahooFinanceService yahooFinanceService;

    @GetMapping("/{ticker}")
    public ResponseEntity<FundPerformance> getCAGR(@PathVariable String ticker) {
        try {
            FundPerformance performance = yahooFinanceService.getOrFetchCAGR(ticker);
            return ResponseEntity.ok(performance);
        } catch (Exception e) {
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