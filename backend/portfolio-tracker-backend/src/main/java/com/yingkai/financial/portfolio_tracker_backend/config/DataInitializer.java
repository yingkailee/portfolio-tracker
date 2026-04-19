package com.yingkai.financial.portfolio_tracker_backend.config;

import com.yingkai.financial.portfolio_tracker_backend.entity.Fund;
import com.yingkai.financial.portfolio_tracker_backend.entity.Portfolio;
import com.yingkai.financial.portfolio_tracker_backend.entity.User;
import com.yingkai.financial.portfolio_tracker_backend.repository.FundRepository;
import com.yingkai.financial.portfolio_tracker_backend.repository.PortfolioRepository;
import com.yingkai.financial.portfolio_tracker_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private final FundRepository fundRepository;
    private final UserRepository userRepository;
    private final PortfolioRepository portfolioRepository;

    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            if (fundRepository.count() == 0) {
                Fund f1 = new Fund(); f1.setTicker("VOO"); f1.setName("Vanguard S&P 500 ETF"); f1.setAverageAnnualYield(10.5); f1.setDescription("Tracks S&P 500 index"); f1.setWeight(0.0);
                Fund f2 = new Fund(); f2.setTicker("VTI"); f2.setName("Vanguard Total Stock Market ETF"); f2.setAverageAnnualYield(10.2); f2.setDescription("Tracks entire US stock market"); f2.setWeight(0.0);
                Fund f3 = new Fund(); f3.setTicker("BND"); f3.setName("Vanguard Total Bond Market ETF"); f3.setAverageAnnualYield(4.5); f3.setDescription("Tracks US investment-grade bonds"); f3.setWeight(0.0);
                Fund f4 = new Fund(); f4.setTicker("VNQ"); f4.setName("Vanguard Real Estate ETF"); f4.setAverageAnnualYield(8.5); f4.setDescription("Tracks US real estate sector"); f4.setWeight(0.0);
                Fund f5 = new Fund(); f5.setTicker("QQQ"); f5.setName("Invesco QQQ Trust"); f5.setAverageAnnualYield(14.2); f5.setDescription("Tracks Nasdaq-100 index"); f5.setWeight(0.0);
                Fund f6 = new Fund(); f6.setTicker("VEA"); f6.setName("Vanguard FTSE Developed Markets ETF"); f6.setAverageAnnualYield(7.8); f6.setDescription("Tracks developed international markets"); f6.setWeight(0.0);
                fundRepository.save(f1);
                fundRepository.save(f2);
                fundRepository.save(f3);
                fundRepository.save(f4);
                fundRepository.save(f5);
                fundRepository.save(f6);
            }

            if (userRepository.count() == 0) {
                User user = new User();
                user.setUsername("admin");
                user.setPassword(passwordEncoder.encode("1234"));
                user = userRepository.save(user);

                Portfolio portfolio = new Portfolio();
                portfolio.setName("My Portfolio");
                portfolio.setAllocations("{\"VOO\":0.7,\"BND\":0.3}");
                portfolio.setUser(user);
                portfolioRepository.save(portfolio);
            }
        };
    }
}