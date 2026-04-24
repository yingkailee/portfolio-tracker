package com.yingkai.financial.portfolio_tracker_backend.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yingkai.financial.portfolio_tracker_backend.entity.Fund;
import com.yingkai.financial.portfolio_tracker_backend.repository.FundRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final FundRepository fundRepository;

    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            if (fundRepository.count() == 0) {
                ObjectMapper mapper = new ObjectMapper();
                Map<String, List<Map<String, String>>> data = mapper.readValue(
                    getClass().getResourceAsStream("/funds.json"),
                    new TypeReference<>() {}
                );
                
                for (Map<String, String> fund : data.get("funds")) {
                    Fund f = new Fund();
                    f.setTicker(fund.get("ticker"));
                    f.setName(fund.get("name"));
                    fundRepository.save(f);
                }
            }
        };
    }
}