package com.yingkai.financial.portfolio_tracker_backend.config;

import com.yingkai.financial.portfolio_tracker_backend.entity.Fund;
import com.yingkai.financial.portfolio_tracker_backend.entity.FundType;
import com.yingkai.financial.portfolio_tracker_backend.repository.FundRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final FundRepository fundRepository;

    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            if (fundRepository.count() == 0) {
                for (FundType type : FundType.values()) {
                    fundRepository.save(new Fund(null, type.getTicker(), type.getName()));
                }
            }
        };
    }
}