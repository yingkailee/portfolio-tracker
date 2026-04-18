package com.yingkai.financial.portfolio_tracker_backend.controller;

import com.yingkai.financial.portfolio_tracker_backend.entity.Fund;
import com.yingkai.financial.portfolio_tracker_backend.repository.FundRepository;
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
public class YieldController {

    private final FundRepository fundRepository;

    @PostMapping("/portfolio-yield")
    public ResponseEntity<Map<String, Object>> calculateYield(@RequestBody Map<String, Double> allocations) {
        List<Fund> funds = fundRepository.findAll();
        Map<String, Double> fundYields = new HashMap<>();
        funds.forEach(f -> fundYields.put(f.getTicker(), f.getAverageAnnualYield()));

        double yield_ = allocations.entrySet().stream()
                .mapToDouble(e -> e.getValue() * fundYields.getOrDefault(e.getKey(), 0.0))
                .sum();

        Map<String, Object> response = new HashMap<>();
        response.put("yield", Math.round(yield_ * 100.0) / 100.0);
        return ResponseEntity.ok(response);
    }
}