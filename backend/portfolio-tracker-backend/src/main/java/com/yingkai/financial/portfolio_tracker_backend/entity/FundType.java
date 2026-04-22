package com.yingkai.financial.portfolio_tracker_backend.entity;

public enum FundType {
    VOO("VOO", "Vanguard S&P 500 ETF"),
    VTI("VTI", "Vanguard Total Stock Market ETF"),
    BND("BND", "Vanguard Total Bond Market ETF"),
    VNQ("VNQ", "Vanguard Real Estate ETF"),
    QQQ("QQQ", "Invesco QQQ Trust"),
    VEA("VEA", "Vanguard FTSE Developed Markets ETF");

    private final String ticker;
    private final String name;

    FundType(String ticker, String name) {
        this.ticker = ticker;
        this.name = name;
    }

    public String getTicker() {
        return ticker;
    }

    public String getName() {
        return name;
    }
}
