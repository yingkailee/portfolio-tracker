package com.yingkai.financial.portfolio_tracker_backend.service;

import com.yingkai.financial.portfolio_tracker_backend.entity.Fund;
import com.yingkai.financial.portfolio_tracker_backend.repository.FundRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FundService {

    private final FundRepository fundRepository;

    public List<Fund> findAll() {
        return fundRepository.findAll();
    }

    public Optional<Fund> findByTicker(String ticker) {
        return fundRepository.findByTicker(ticker);
    }
}
