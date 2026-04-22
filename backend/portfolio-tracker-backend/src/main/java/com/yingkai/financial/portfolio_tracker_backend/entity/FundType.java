package com.yingkai.financial.portfolio_tracker_backend.entity;

public enum FundType {
    VOO("VOO", "Vanguard S&P 500 ETF"),
    VTI("VTI", "Vanguard Total Stock Market ETF"),
    BND("BND", "Vanguard Total Bond Market ETF"),
    VNQ("VNQ", "Vanguard Real Estate ETF"),
    QQQ("QQQ", "Invesco QQQ Trust"),
    VEA("VEA", "Vanguard FTSE Developed Markets ETF"),
    SPY("SPY", "State Street SPDR S&P 500 ETF Trust"),
    XLE("XLE", "State Street Energy Select Sector SPDR ETF"),
    XLF("XLF", "State Street Financial Select Sector SPDR ETF"),
    SCHX("SCHX", "Schwab U.S. Large-Cap ETF"),
    XLU("XLU", "State Street Utilities Select Sector SPDR ETF"),
    SCHG("SCHG", "Schwab U.S. Large-Cap Growth ETF"),
    XLK("XLK", "State Street Technology Select Sector SPDR ETF"),
    USHY("USHY", "iShares Broad USD High Yield Corporate Bond ETF"),
    SPYM("SPYM", "State Street SPDR Portfolio S&P 500 ETF"),
    SCHF("SCHF", "Schwab International Equity ETF"),
    VTSAX("VTSAX", "Vanguard Total Stock Market Index Fund Admiral Shares"),
    VFIAX("VFIAX", "Vanguard 500 Index Fund Admiral Shares"),
    FXAIX("FXAIX", "Fidelity 500 Index Fund"),
    VTIAX("VTIAX", "Vanguard Total International Stock Index Fund Admiral Shares"),
    SPAXX("SPAXX", "Fidelity Government Money Market Fund"),
    FZCXX("FZCXX", "Fidelity Government Money Market Fund Premium Class"),
    VBTLX("VBTLX", "Vanguard Total Bond Market Index Fund Admiral Shares"),
    VINIX("VINIX", "Vanguard Institutional Index Fund"),
    AGTHX("AGTHX", "American Funds The Growth Fund of America Class A"),
    GFACX("GFACX", "American Funds The Growth Fund of America Class C"),
    NVDA("NVDA", "NVIDIA Corporation"),
    GOOGL("GOOGL", "Alphabet Inc. Class A"),
    GOOG("GOOG", "Alphabet Inc. Class C"),
    AAPL("AAPL", "Apple Inc."),
    MSFT("MSFT", "Microsoft Corporation"),
    AMZN("AMZN", "Amazon.com Inc."),
    TSM("TSM", "Taiwan Semiconductor Manufacturing Company Limited"),
    AVGO("AVGO", "Broadcom Inc."),
    META("META", "Meta Platforms Inc."),
    TSLA("TSLA", "Tesla Inc."),
    JPM("JPM", "JPMorgan Chase & Co."),
    WMT("WMT", "Walmart Inc."),
    LLY("LLY", "Eli Lilly and Company"),
    XOM("XOM", "Exxon Mobil Corporation"),
    V("V", "Visa Inc."),
    ASML("ASML", "ASML Holding N.V."),
    JNJ("JNJ", "Johnson & Johnson"),
    BAC("BAC", "Bank of America Corporation"),
    ORCL("ORCL", "Oracle Corporation"),
    MU("MU", "Micron Technology Inc."),
    AMD("AMD", "Advanced Micro Devices Inc."),
    MA("MA", "Mastercard Incorporated"),
    COST("COST", "Costco Wholesale Corporation"),
    NFLX("NFLX", "Netflix Inc."),
    CAT("CAT", "Caterpillar Inc."),
    CVX("CVX", "Chevron Corporation"),
    ABBV("ABBV", "AbbVie Inc."),
    CSCO("CSCO", "Cisco Systems Inc."),
    GS("GS", "The Goldman Sachs Group Inc."),
    HD("HD", "The Home Depot Inc."),
    INTC("INTC", "Intel Corporation"),
    PG("PG", "The Procter & Gamble Company"),
    C("C", "Citigroup Inc."),
    MS("MS", "Morgan Stanley"),
    KO("KO", "The Coca-Cola Company"),
    UNH("UNH", "UnitedHealth Group Incorporated"),
    MCD("MCD", "McDonald's Corporation"),
    PEP("PEP", "PepsiCo Inc."),
    BA("BA", "The Boeing Company"),
    DIS("DIS", "The Walt Disney Company"),
    IBM("IBM", "International Business Machines Corporation"),
    SHOP("SHOP", "Shopify Inc.");

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