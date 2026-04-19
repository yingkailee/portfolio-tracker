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
                    new Fund(null, "VOO", "Vanguard S&P 500 ETF", 10.5, "Tracks S&P 500 index", 0.0),
                    new Fund(null, "VTI", "Vanguard Total Stock Market ETF", 10.2, "Tracks entire US stock market", 0.0),
                    new Fund(null, "BND", "Vanguard Total Bond Market ETF", 4.5, "Tracks US investment-grade bonds", 0.0),
                    new Fund(null, "VNQ", "Vanguard Real Estate ETF", 8.5, "Tracks US real estate sector", 0.0),
                    new Fund(null, "QQQ", "Invesco QQQ Trust", 14.2, "Tracks Nasdaq-100 index", 0.0),
                    new Fund(null, "VEA", "Vanguard FTSE Developed Markets ETF", 7.8, "Tracks developed international markets", 0.0)
                ));
            }

            };
    }
}