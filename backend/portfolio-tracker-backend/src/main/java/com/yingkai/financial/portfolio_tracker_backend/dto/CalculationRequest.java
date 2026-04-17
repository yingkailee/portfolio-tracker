package com.yingkai.financial.portfolio_tracker_backend.dto;

public class CalculationRequest {
    private Double currentNetWorth;
    private Double yearlySavings;
    private Integer timeHorizonYears;
    private Double portfolioYield;

    public CalculationRequest() {}

    public CalculationRequest(Double currentNetWorth, Double yearlySavings, Integer timeHorizonYears, Double portfolioYield) {
        this.currentNetWorth = currentNetWorth;
        this.yearlySavings = yearlySavings;
        this.timeHorizonYears = timeHorizonYears;
        this.portfolioYield = portfolioYield;
    }

    public Double getCurrentNetWorth() { return currentNetWorth; }
    public void setCurrentNetWorth(Double currentNetWorth) { this.currentNetWorth = currentNetWorth; }
    public Double getYearlySavings() { return yearlySavings; }
    public void setYearlySavings(Double yearlySavings) { this.yearlySavings = yearlySavings; }
    public Integer getTimeHorizonYears() { return timeHorizonYears; }
    public void setTimeHorizonYears(Integer timeHorizonYears) { this.timeHorizonYears = timeHorizonYears; }
    public Double getPortfolioYield() { return portfolioYield; }
    public void setPortfolioYield(Double portfolioYield) { this.portfolioYield = portfolioYield; }
}
