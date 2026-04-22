package com.yingkai.financial.portfolio_tracker_backend.controller;

import com.yingkai.financial.portfolio_tracker_backend.dto.CalculationRequest;
import com.yingkai.financial.portfolio_tracker_backend.dto.CalculationResponse;
import com.yingkai.financial.portfolio_tracker_backend.entity.Fund;
import com.yingkai.financial.portfolio_tracker_backend.service.CalculationService;
import com.yingkai.financial.portfolio_tracker_backend.service.FundService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PortfolioController {

    private final FundService fundService;
    private final CalculationService calculationService;

    @GetMapping("/funds")
    public ResponseEntity<List<Fund>> getAllFunds() {
        return ResponseEntity.ok(fundService.findAll());
    }

    @PostMapping("/calculate")
    public ResponseEntity<CalculationResponse> calculateProjection(@RequestBody CalculationRequest request) {
        return ResponseEntity.ok(calculationService.calculateProjection(request));
    }

}
