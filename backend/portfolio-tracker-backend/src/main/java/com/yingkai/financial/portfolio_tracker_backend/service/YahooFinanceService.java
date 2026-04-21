package com.yingkai.financial.portfolio_tracker_backend.service;

import com.yingkai.financial.portfolio_tracker_backend.entity.FundPerformance;
import com.yingkai.financial.portfolio_tracker_backend.repository.FundPerformanceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class YahooFinanceService {

    private static final String YAHOO_URL = "https://query1.finance.yahoo.com/v8/finance/chart/%s?range=15y&interval=1mo";
    private static final int EXPIRY_DAYS = 30;

    private final FundPerformanceRepository fundPerformanceRepository;

    public FundPerformance getOrFetchCAGR(String ticker) {
        Timestamp now = Timestamp.from(Instant.now());
        
        Optional<FundPerformance> existing = fundPerformanceRepository.findByTicker(ticker);
        if (existing.isPresent() && now.before(existing.get().getExpiresAt())) {
            return existing.get();
        }

        return fetchAndStoreCAGR(ticker);
    }

    public FundPerformance fetchAndStoreCAGR(String ticker) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = String.format(YAHOO_URL, ticker);
            
            @SuppressWarnings("rawtypes")
            Map response = restTemplate.getForObject(url, Map.class);
            
            if (response == null) {
                throw new RuntimeException("Empty response from Yahoo");
            }

            Map result = (Map) response.get("chart");
            if (result == null) {
                throw new RuntimeException("No chart data in response");
            }

            List<Map> resultList = (List) result.get("result");
            if (resultList == null || resultList.isEmpty()) {
                throw new RuntimeException("No result data");
            }

            Map quote = resultList.get(0);
            Map indicators = (Map) quote.get("indicators");
            if (indicators == null) {
                throw new RuntimeException("No indicators");
            }

            List<Map> quoteList = (List) indicators.get("quote");
            if (quoteList == null || quoteList.isEmpty()) {
                throw new RuntimeException("No quote data");
            }

            Map quoteData = quoteList.get(0);
            List<Long> timestamps = (List) quoteData.get("timestamp");
            List<Double> adjustedClose = (List) quoteData.get("adjclose");

            if (timestamps == null || adjustedClose == null) {
                throw new RuntimeException("Missing timestamp or adjclose data");
            }

            List<Map.Entry<LocalDate, Double>> monthlyData = new ArrayList<>();
            for (int i = 0; i < timestamps.size(); i++) {
                Long ts = timestamps.get(i);
                Double close = adjustedClose.get(i);
                if (ts != null && close != null) {
                    LocalDate date = Instant.ofEpochMilli(ts * 1000)
                            .atZone(ZoneId.of("America/New_York"))
                            .toLocalDate();
                    monthlyData.add(Map.entry(date, close));
                }
            }

            if (monthlyData.isEmpty()) {
                throw new RuntimeException("No valid data points");
            }

            monthlyData.sort(Comparator.comparing(Map.Entry::getKey));

            LocalDate startDate = monthlyData.get(0).getKey();
            LocalDate endDate = monthlyData.get(monthlyData.size() - 1).getKey();
            double startPrice = monthlyData.get(0).getValue();
            double endPrice = monthlyData.get(monthlyData.size() - 1).getValue();

            double cagr15yr = startPrice > 0 ? Math.pow(endPrice / startPrice, 1.0 / 15.0) - 1 : 0;
            double cagr10yr = calculateCAGR(monthlyData, 10);
            double cagr5yr = calculateCAGR(monthlyData, 5);

            Timestamp now = Timestamp.from(Instant.now());
            Timestamp expiresAt = Timestamp.from(Instant.now().plusSeconds(EXPIRY_DAYS * 24L * 60L * 60L));

            FundPerformance performance = new FundPerformance();
            performance.setTicker(ticker);
            performance.setCagr5yr(cagr5yr);
            performance.setCagr10yr(cagr10yr);
            performance.setCagr15yr(cagr15yr);
            performance.setDataStartDate(startDate);
            performance.setDataEndDate(endDate);
            performance.setCalculatedAt(now);
            performance.setExpiresAt(expiresAt);

            return fundPerformanceRepository.save(performance);

        } catch (Exception e) {
            log.error("Failed to fetch CAGR for {}: {}", ticker, e.getMessage());
            throw new RuntimeException("Failed to fetch data: " + e.getMessage());
        }
    }

    private double calculateCAGR(List<Map.Entry<LocalDate, Double>> monthlyData, int years) {
        if (monthlyData.isEmpty()) return 0;

        LocalDate targetDate = monthlyData.get(monthlyData.size() - 1).getKey().minusYears(years);

        Map.Entry<LocalDate, Double> startEntry = null;
        Map.Entry<LocalDate, Double> endEntry = null;

        for (int i = 0; i < monthlyData.size(); i++) {
            if (monthlyData.get(i).getKey().isAfter(targetDate) || monthlyData.get(i).getKey().equals(targetDate)) {
                if (startEntry == null) {
                    startEntry = monthlyData.get(i);
                }
                endEntry = monthlyData.get(i);
            }
        }

        if (startEntry == null || endEntry == null || startEntry.getValue() == 0) {
            return 0;
        }

        long actualYears = java.time.temporal.ChronoUnit.YEARS.between(startEntry.getKey(), endEntry.getKey());
        if (actualYears < 1) return 0;

        return Math.pow(endEntry.getValue() / startEntry.getValue(), 1.0 / actualYears) - 1;
    }
}