package com.yingkai.financial.portfolio_tracker_backend.controller;

import com.yingkai.financial.portfolio_tracker_backend.dto.PortfolioRequest;
import com.yingkai.financial.portfolio_tracker_backend.entity.Portfolio;
import com.yingkai.financial.portfolio_tracker_backend.entity.User;
import com.yingkai.financial.portfolio_tracker_backend.repository.PortfolioRepository;
import com.yingkai.financial.portfolio_tracker_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PortfolioApiController {

    private final PortfolioRepository portfolioRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Portfolio>> getPortfolios(@RequestParam Integer userId) {
        return ResponseEntity.ok(portfolioRepository.findByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<Portfolio> createPortfolio(@RequestBody PortfolioRequest request) {
        User user = userRepository.findById(request.getUserId()).orElse(null);
        Portfolio portfolio = new Portfolio();
        portfolio.setName(request.getName());
        portfolio.setAllocations(request.getAllocations());
        portfolio.setUser(user);
        return ResponseEntity.ok(portfolioRepository.save(portfolio));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Portfolio> updatePortfolio(@PathVariable Integer id, @RequestBody PortfolioRequest request) {
        Portfolio portfolio = portfolioRepository.findById(id).orElse(null);
        if (portfolio == null) return ResponseEntity.notFound().build();
        portfolio.setName(request.getName());
        portfolio.setAllocations(request.getAllocations());
        return ResponseEntity.ok(portfolioRepository.save(portfolio));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePortfolio(@PathVariable Integer id) {
        portfolioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}