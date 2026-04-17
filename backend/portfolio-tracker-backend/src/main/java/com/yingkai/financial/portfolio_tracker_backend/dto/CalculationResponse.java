package com.yingkai.financial.portfolio_tracker_backend.dto;

public class CalculationResponse {
    private Double currentNetWorth;
    private Double yearlySavings;
    private Integer timeHorizonYears;
    private Double portfolioYield;
    private Double finalNetWorth;
    private Double totalContributions;
    private Double totalGrowth;

    public CalculationResponse() {}

    public CalculationResponse(Double currentNetWorth, Double yearlySavings, Integer timeHorizonYears,
                               Double portfolioYield, Double finalNetWorth, Double totalContributions, Double totalGrowth) {
        this.currentNetWorth = currentNetWorth;
        this.yearlySavings = yearlySavings;
        this.timeHorizonYears = timeHorizonYears;
        this.portfolioYield = portfolioYield;
        this.finalNetWorth = finalNetWorth;
        this.totalContributions = totalContributions;
        this.totalGrowth = totalGrowth;
    }

    public Double getCurrentNetWorth() { return currentNetWorth; }
    public void setCurrentNetWorth(Double currentNetWorth) { this.currentNetWorth = currentNetWorth; }
    public Double getYearlySavings() { return yearlySavings; }
    public void setYearlySavings(Double yearlySavings) { this.yearlySavings = yearlySavings; }
    public Integer getTimeHorizonYears() { return timeHorizonYears; }
    public void setTimeHorizonYears(Integer timeHorizonYears) { this.timeHorizonYears = timeHorizonYears; }
    public Double getPortfolioYield() { return portfolioYield; }
    public void setPortfolioYield(Double portfolioYield) { this.portfolioYield = portfolioYield; }
    public Double getFinalNetWorth() { return finalNetWorth; }
    public void setFinalNetWorth(Double finalNetWorth) { this.finalNetWorth = finalNetWorth; }
    public Double getTotalContributions() { return totalContributions; }
    public void setTotalContributions(Double totalContributions) { this.totalContributions = totalContributions; }
    public Double getTotalGrowth() { return totalGrowth; }
    public void setTotalGrowth(Double totalGrowth) { this.totalGrowth = totalGrowth; }
}
