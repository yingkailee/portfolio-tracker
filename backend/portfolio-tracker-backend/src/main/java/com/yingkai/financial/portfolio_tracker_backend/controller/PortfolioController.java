package com.yingkai.financial.portfolio_tracker_backend.controller;

import com.yingkai.financial.portfolio_tracker_backend.dto.CalculationRequest;
import com.yingkai.financial.portfolio_tracker_backend.dto.CalculationResponse;
import com.yingkai.financial.portfolio_tracker_backend.entity.Fund;
import com.yingkai.financial.portfolio_tracker_backend.repository.FundRepository;
import com.yingkai.financial.portfolio_tracker_backend.service.CalculationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PortfolioController {

    @Autowired
    private FundRepository fundRepository;

    @Autowired
    private CalculationService calculationService;

    @GetMapping("/funds")
    public ResponseEntity<List<Fund>> getAllFunds() {
        return ResponseEntity.ok(fundRepository.findAll());
    }

    @PostMapping("/calculate")
    public ResponseEntity<CalculationResponse> calculateProjection(@RequestBody CalculationRequest request) {
        return ResponseEntity.ok(calculationService.calculateProjection(request));
    }

    @PostMapping("/calculate-from-allocation")
    public ResponseEntity<CalculationResponse> calculateFromAllocation(
            @RequestParam Double currentNetWorth,
            @RequestParam Double yearlySavings,
            @RequestParam Integer timeHorizonYears,
            @RequestBody Map<String, Double> allocations) {
        
        List<Fund> funds = fundRepository.findAll();
        Map<String, Double> fundYields = new HashMap<>();
        funds.forEach(f -> fundYields.put(f.getTicker(), f.getAverageAnnualYield()));

        double portfolioYield = calculationService.calculatePortfolioYield(allocations, fundYields);

        CalculationRequest request = new CalculationRequest(
                currentNetWorth,
                yearlySavings,
                timeHorizonYears,
                portfolioYield
        );

        return ResponseEntity.ok(calculationService.calculateProjection(request));
    }
}
