package com.yingkai.financial.portfolio_tracker_backend.entity;

public enum FundType {
    VOO("VOO", "Vanguard S&P 500 ETF"),
    VTI("VTI", "Vanguard Total Stock Market ETF"),
    BND("BND", "Vanguard Total Bond Market ETF"),
    VNQ("VNQ", "Vanguard Real Estate ETF"),
    QQQ("QQQ", "Invesco QQQ Trust"),
    VEA("VEA", "Vanguard FTSE Developed Markets ETF"),
    VTSAX("VTSAX", "Vanguard Total Stock Market Index Fund Admiral Shares"),
    VFIAX("VFIAX", "Vanguard 500 Index Fund Admiral Shares"),
    FXAIX("FXAIX", "Fidelity 500 Index Fund"),
    VTIAX("VTIAX", "Vanguard Total International Stock Index Fund Admiral Shares"),
    SPAXX("SPAXX", "Fidelity Government Money Market Fund"),
    FZCXX("FZCXX", "Fidelity Government Money Market Fund Premium Class"),
    VBTLX("VBTLX", "Vanguard Total Bond Market Index Fund Admiral Shares"),
    VINIX("VINIX", "Vanguard Institutional Index Fund"),
    AGTHX("AGTHX", "American Funds The Growth Fund of America Class A"),
    GFACX("GFACX", "American Funds The Growth Fund of America Class C");

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
