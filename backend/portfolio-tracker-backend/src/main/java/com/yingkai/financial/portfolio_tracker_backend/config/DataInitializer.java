package com.yingkai.financial.portfolio_tracker_backend.config;

import com.yingkai.financial.portfolio_tracker_backend.entity.Fund;
import java.util.List;
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
                fundRepository.saveAll(List.of(
                    makeFund("VOO", "Vanguard S&P 500 ETF", 10.5, "Tracks S&P 500 index"),
                    makeFund("VTI", "Vanguard Total Stock Market ETF", 10.2, "Tracks entire US stock market"),
                    makeFund("BND", "Vanguard Total Bond Market ETF", 4.5, "Tracks US investment-grade bonds"),
                    makeFund("VNQ", "Vanguard Real Estate ETF", 8.5, "Tracks US real estate sector"),
                    makeFund("QQQ", "Invesco QQQ Trust", 14.2, "Tracks Nasdaq-100 index"),
                    makeFund("VEA", "Vanguard FTSE Developed Markets ETF", 7.8, "Tracks developed international markets")
                ));
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

    private Fund makeFund(String ticker, String name, double yield_, String desc) {
        Fund f = new Fund();
        f.setTicker(ticker);
        f.setName(name);
        f.setAverageAnnualYield(yield_);
        f.setDescription(desc);
        f.setWeight(0.0);
        return f;
    }
}