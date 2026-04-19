package com.yingkai.financial.portfolio_tracker_backend.controller;

import com.yingkai.financial.portfolio_tracker_backend.config.JwtUtil;
import com.yingkai.financial.portfolio_tracker_backend.dto.RegisterRequest;
import com.yingkai.financial.portfolio_tracker_backend.entity.Portfolio;
import com.yingkai.financial.portfolio_tracker_backend.entity.User;
import com.yingkai.financial.portfolio_tracker_backend.repository.PortfolioRepository;
import com.yingkai.financial.portfolio_tracker_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final PortfolioRepository portfolioRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody RegisterRequest request) {
        User user = userRepository.findByUsername(request.getUsername());
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid username or password"));
        }
        String token = jwtUtil.generateToken(user.getUsername(), user.getId());
        return ResponseEntity.ok(Map.of("token", token, "userId", user.getId(), "username", user.getUsername()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (request.getUsername() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username and password required"));
        }
        if (request.getUsername().length() < 3) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username must be at least 3 characters"));
        }
        if (request.getPassword().length() < 4) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password must be at least 4 characters"));
        }
        if (userRepository.findByUsername(request.getUsername()) != null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username already taken"));
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user = userRepository.save(user);

        Portfolio portfolio = new Portfolio();
        portfolio.setName("My Portfolio");
        portfolio.setAllocations("{\"VOO\":0.7,\"BND\":0.3}");
        portfolio.setUser(user);
        portfolioRepository.save(portfolio);

        String token = jwtUtil.generateToken(user.getUsername(), user.getId());
        return ResponseEntity.ok(Map.of("token", token, "userId", user.getId()));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String auth) {
        if (auth == null || !auth.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }
        String token = auth.substring(7);
        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).build();
        }
        String username = jwtUtil.getUsername(token);
        int userId = jwtUtil.getUserId(token);
        return ResponseEntity.ok(Map.of("userId", userId, "username", username));
    }
}