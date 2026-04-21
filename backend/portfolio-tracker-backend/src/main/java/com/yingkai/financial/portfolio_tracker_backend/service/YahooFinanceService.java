package com.yingkai.financial.portfolio_tracker_backend.service;

import com.yingkai.financial.portfolio_tracker_backend.entity.FundPerformance;
import com.yingkai.financial.portfolio_tracker_backend.repository.FundPerformanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

@Service
public class YahooFinanceService {

    private static final String[] YAHOO_HOSTS = {
        "query1.finance.yahoo.com",
        "query2.finance.yahoo.com"
    };
    private static final int EXPIRY_DAYS = 30;

    private final FundPerformanceRepository fundPerformanceRepository;

    @Autowired
    public YahooFinanceService(FundPerformanceRepository fundPerformanceRepository) {
        this.fundPerformanceRepository = fundPerformanceRepository;
    }

    public FundPerformance getOrFetchCAGR(String ticker) {
        Timestamp now = Timestamp.from(Instant.now());
        
        Optional<FundPerformance> existing = fundPerformanceRepository.findByTicker(ticker);
        if (existing.isPresent() && now.before(existing.get().getExpiresAt())) {
            return existing.get();
        }

        return fetchAndStoreCAGR(ticker);
    }

    public FundPerformance fetchAndStoreCAGR(String ticker) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
        headers.set("Accept", "application/json");

        String lastError = null;
        
        for (String host : YAHOO_HOSTS) {
            try {
                String url = "https://" + host + "/v8/finance/chart/" + ticker + "?range=15y&interval=1mo";
                HttpEntity<?> entity = new HttpEntity<>(headers);
                RestTemplate restTemplate = new RestTemplate();
                ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
                
                Map<String, Object> responseBody = response.getBody();
                if (responseBody == null) {
                    throw new RuntimeException("Empty response from Yahoo");
                }
                
                FundPerformance perf = processYahooResponse(ticker, responseBody);
                return fundPerformanceRepository.save(perf);
                
            } catch (Exception e) {
                lastError = e.getMessage();
                System.err.println("Failed with " + host + ": " + e.getMessage());
                continue;
            }
        }
        
        throw new RuntimeException("All Yahoo hosts failed: " + lastError);
    }

    private FundPerformance processYahooResponse(String ticker, Map<String, Object> response) {
        Map chart = (Map) response.get("chart");
        if (chart == null) {
            throw new RuntimeException("No chart data");
        }

        List<Map> results = (List<Map>) chart.get("result");
        if (results == null || results.isEmpty()) {
            throw new RuntimeException("No result data");
        }

        Map quote = results.get(0);
        
        List timestampsRaw = (List) quote.get("timestamp");
        List<Long> timestamps = new ArrayList<>();
        for (Object ts : timestampsRaw) {
            if (ts instanceof Number) {
                timestamps.add(((Number) ts).longValue());
            }
        }
        
        Map indicators = (Map) quote.get("indicators");
        if (indicators == null) {
            throw new RuntimeException("No indicators");
        }

        List<Map> adjcloseList = (List<Map>) indicators.get("adjclose");
        if (adjcloseList == null || adjcloseList.isEmpty()) {
            throw new RuntimeException("No adjclose data");
        }

        Map adjcloseData = adjcloseList.get(0);
        
        List closeRaw = (List) adjcloseData.get("adjclose");
        List<Double> adjustedClose = new ArrayList<>();
        for (Object c : closeRaw) {
            if (c instanceof Number) {
                adjustedClose.add(((Number) c).doubleValue());
            }
        }

        if (timestamps == null || adjustedClose == null) {
            throw new RuntimeException("Missing timestamp or adjclose data");
        }

        List<Map.Entry<LocalDate, Double>> monthlyData = new ArrayList<>();
        for (int i = 0; i < timestamps.size(); i++) {
            Long ts = timestamps.get(i);
            Double close = i < adjustedClose.size() ? adjustedClose.get(i) : null;
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

        LocalDate now = LocalDate.now();
        if (!monthlyData.isEmpty()) {
            LocalDate lastDate = monthlyData.get(monthlyData.size() - 1).getKey();
            if (lastDate.getYear() == now.getYear() && lastDate.getMonthValue() == now.getMonthValue()) {
                monthlyData.remove(monthlyData.size() - 1);
            }
        }

        if (monthlyData.isEmpty()) {
            throw new RuntimeException("No complete monthly data points");
        }

        LocalDate startDate = monthlyData.get(0).getKey();
        LocalDate endDate = monthlyData.get(monthlyData.size() - 1).getKey();
        double startPrice = monthlyData.get(0).getValue();
        double endPrice = monthlyData.get(monthlyData.size() - 1).getValue();

        double cagr15yr = startPrice > 0 ? Math.pow(endPrice / startPrice, 1.0 / 15.0) - 1 : 0;
        double cagr10yr = calculateCAGR(monthlyData, 10);
        double cagr5yr = calculateCAGR(monthlyData, 5);

        Timestamp now = Timestamp.from(Instant.now());
        Timestamp expiresAt = Timestamp.from(Instant.now().plusSeconds(EXPIRY_DAYS * 24L * 60L * 60L));

        FundPerformance perf = new FundPerformance();
        perf.setTicker(ticker);
        perf.setCagr5yr(cagr5yr);
        perf.setCagr10yr(cagr10yr);
        perf.setCagr15yr(cagr15yr);
        perf.setDataStartDate(startDate);
        perf.setDataEndDate(endDate);
        perf.setCalculatedAt(now);
        perf.setExpiresAt(expiresAt);

        return perf;
    }

    private double calculateCAGR(List<Map.Entry<LocalDate, Double>> monthlyData, int years) {
        if (monthlyData.isEmpty()) return 0;

        LocalDate targetDate = monthlyData.get(monthlyData.size() - 1).getKey().minusYears(years);

        Map.Entry<LocalDate, Double> startEntry = null;
        Map.Entry<LocalDate, Double> endEntry = null;

        for (Map.Entry<LocalDate, Double> entry : monthlyData) {
            if (entry.getKey().isAfter(targetDate) || entry.getKey().equals(targetDate)) {
                if (startEntry == null) {
                    startEntry = entry;
                }
                endEntry = entry;
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