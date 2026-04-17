package com.yingkai.financial.portfolio_tracker_backend.config;

import com.yingkai.financial.portfolio_tracker_backend.entity.Fund;
import com.yingkai.financial.portfolio_tracker_backend.repository.FundRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(FundRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                Fund voo = new Fund();
                voo.setTicker("VOO");
                voo.setName("Vanguard S&P 500 ETF");
                voo.setAverageAnnualYield(10.5);
                voo.setDescription("Tracks S&P 500 index");
                voo.setWeight(0.0);
                repository.save(voo);

                Fund vti = new Fund();
                vti.setTicker("VTI");
                vti.setName("Vanguard Total Stock Market ETF");
                vti.setAverageAnnualYield(10.2);
                vti.setDescription("Tracks entire US stock market");
                vti.setWeight(0.0);
                repository.save(vti);

                Fund bnd = new Fund();
                bnd.setTicker("BND");
                bnd.setName("Vanguard Total Bond Market ETF");
                bnd.setAverageAnnualYield(4.5);
                bnd.setDescription("Tracks US investment-grade bonds");
                bnd.setWeight(0.0);
                repository.save(bnd);

                Fund vnq = new Fund();
                vnq.setTicker("VNQ");
                vnq.setName("Vanguard Real Estate ETF");
                vnq.setAverageAnnualYield(8.5);
                vnq.setDescription("Tracks US real estate sector");
                vnq.setWeight(0.0);
                repository.save(vnq);

                Fund qqq = new Fund();
                qqq.setTicker("QQQ");
                qqq.setName("Invesco QQQ Trust");
                qqq.setAverageAnnualYield(14.2);
                qqq.setDescription("Tracks Nasdaq-100 index");
                qqq.setWeight(0.0);
                repository.save(qqq);

                Fund vea = new Fund();
                vea.setTicker("VEA");
                vea.setName("Vanguard FTSE Developed Markets ETF");
                vea.setAverageAnnualYield(7.8);
                vea.setDescription("Tracks developed international markets");
                vea.setWeight(0.0);
                repository.save(vea);
            }
        };
    }
}
