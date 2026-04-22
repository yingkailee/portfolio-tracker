package com.yingkai.financial.portfolio_tracker_backend.controller;

import com.yingkai.financial.portfolio_tracker_backend.dto.PortfolioRequest;
import com.yingkai.financial.portfolio_tracker_backend.entity.Portfolio;
import com.yingkai.financial.portfolio_tracker_backend.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/portfolios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PortfolioApiController {

    private final PortfolioService portfolioService;

    @GetMapping
    public ResponseEntity<List<Portfolio>> getPortfolios(@RequestParam Integer userId) {
        return ResponseEntity.ok(portfolioService.findByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<Portfolio> createPortfolio(@RequestBody PortfolioRequest request) {
        Portfolio portfolio = new Portfolio();
        portfolio.setName(request.getName());
        portfolio.setAllocations(request.getAllocations());
        return ResponseEntity.ok(portfolioService.save(portfolio));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Portfolio> updatePortfolio(@PathVariable Integer id, @RequestBody PortfolioRequest request) {
        Optional<Portfolio> optPortfolio = portfolioService.findById(id);
        if (optPortfolio.isEmpty()) return ResponseEntity.notFound().build();
        Portfolio portfolio = optPortfolio.get();
        portfolio.setName(request.getName());
        portfolio.setAllocations(request.getAllocations());
        return ResponseEntity.ok(portfolioService.save(portfolio));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePortfolio(@PathVariable Integer id) {
        portfolioService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}