package com.yingkai.financial.portfolio_tracker_backend.config;

import com.yingkai.financial.portfolio_tracker_backend.entity.Fund;
import com.yingkai.financial.portfolio_tracker_backend.entity.FundType;
import java.util.List;
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
                fundRepository.saveAll(List.of(
                    new Fund(null, FundType.VOO.getTicker(), FundType.VOO.getName()),
                    new Fund(null, FundType.VTI.getTicker(), FundType.VTI.getName()),
                    new Fund(null, FundType.BND.getTicker(), FundType.BND.getName()),
                    new Fund(null, FundType.VNQ.getTicker(), FundType.VNQ.getName()),
                    new Fund(null, FundType.QQQ.getTicker(), FundType.QQQ.getName()),
                    new Fund(null, FundType.VEA.getTicker(), FundType.VEA.getName())
                ));
            }
        };
    }
}