package com.yingkai.financial.portfolio_tracker_backend.controller;

import com.yingkai.financial.portfolio_tracker_backend.dto.CalculationRequest;
import com.yingkai.financial.portfolio_tracker_backend.dto.CalculationResponse;
import com.yingkai.financial.portfolio_tracker_backend.entity.Fund;
import com.yingkai.financial.portfolio_tracker_backend.repository.FundRepository;
import com.yingkai.financial.portfolio_tracker_backend.service.CalculationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PortfolioController {

    private final FundRepository fundRepository;
    private final CalculationService calculationService;

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
            @RequestParam Double initialCapital,
            @RequestParam Double yearlySavings,
            @RequestParam Integer timeHorizonYears,
            @RequestBody Map<String, Double> allocations) {
        
        Map<String, Double> fundYields = new HashMap<>();
        fundRepository.findAll().forEach(f -> fundYields.put(f.getTicker(), f.getAverageAnnualYield()));
        double portfolioYield = calculationService.calculatePortfolioYield(allocations, fundYields);

        return ResponseEntity.ok(calculationService.calculateProjection(
                new CalculationRequest(initialCapital, yearlySavings, timeHorizonYears, portfolioYield)));
    }
}
