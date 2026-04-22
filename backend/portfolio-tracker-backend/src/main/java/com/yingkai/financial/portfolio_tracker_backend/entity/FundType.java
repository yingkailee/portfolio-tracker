package com.yingkai.financial.portfolio_tracker_backend.entity;

public enum FundType {
    AAPL("AAPL", "Apple Inc."),
    ABBV("ABBV", "AbbVie Inc."),
    AGTHX("AGTHX", "American Funds The Growth Fund of America Class A"),
    AMD("AMD", "Advanced Micro Devices Inc."),
    AMGN("AMGN", "Amgen Inc."),
    AMZN("AMZN", "Amazon.com Inc."),
    ASML("ASML", "ASML Holding N.V."),
    AVGO("AVGO", "Broadcom Inc."),
    BAC("BAC", "Bank of America Corporation"),
    BA("BA", "The Boeing Company"),
    BND("BND", "Vanguard Total Bond Market ETF"),
    CAT("CAT", "Caterpillar Inc."),
    C("C", "Citigroup Inc."),
    COST("COST", "Costco Wholesale Corporation"),
    CSCO("CSCO", "Cisco Systems Inc."),
    CVX("CVX", "Chevron Corporation"),
    DIS("DIS", "The Walt Disney Company"),
    FXAIX("FXAIX", "Fidelity 500 Index Fund"),
    FZCXX("FZCXX", "Fidelity Government Money Market Fund Premium Class"),
    GFACX("GFACX", "American Funds The Growth Fund of America Class C"),
    GOOG("GOOG", "Alphabet Inc. Class C"),
    GOOGL("GOOGL", "Alphabet Inc. Class A"),
    GS("GS", "The Goldman Sachs Group Inc."),
    HD("HD", "The Home Depot Inc."),
    IBM("IBM", "International Business Machines Corporation"),
    INTC("INTC", "Intel Corporation"),
    JNJ("JNJ", "Johnson & Johnson"),
    JPM("JPM", "JPMorgan Chase & Co."),
    KO("KO", "The Coca-Cola Company"),
    LLY("LLY", "Eli Lilly and Company"),
    MA("MA", "Mastercard Incorporated"),
    MCD("MCD", "McDonald's Corporation"),
    META("META", "Meta Platforms Inc."),
    MSFT("MSFT", "Microsoft Corporation"),
    MS("MS", "Morgan Stanley"),
    MU("MU", "Micron Technology Inc."),
    NFLX("NFLX", "Netflix Inc."),
    NVDA("NVDA", "NVIDIA Corporation"),
    ORCL("ORCL", "Oracle Corporation"),
    PEP("PEP", "PepsiCo Inc."),
    PG("PG", "The Procter & Gamble Company"),
    QQQ("QQQ", "Invesco QQQ Trust"),
    SCHF("SCHF", "Schwab International Equity ETF"),
    SCHG("SCHG", "Schwab U.S. Large-Cap Growth ETF"),
    SCHX("SCHX", "Schwab U.S. Large-Cap ETF"),
    SHOP("SHOP", "Shopify Inc."),
    SPY("SPY", "State Street SPDR S&P 500 ETF Trust"),
    SPYM("SPYM", "State Street SPDR Portfolio S&P 500 ETF"),
    SPAXX("SPAXX", "Fidelity Government Money Market Fund"),
    TSM("TSM", "Taiwan Semiconductor Manufacturing Company Limited"),
    TSLA("TSLA", "Tesla Inc."),
    UNH("UNH", "UnitedHealth Group Incorporated"),
    USHY("USHY", "iShares Broad USD High Yield Corporate Bond ETF"),
    V("V", "Visa Inc."),
    VBTLX("VBTLX", "Vanguard Total Bond Market Index Fund Admiral Shares"),
    VFIAX("VFIAX", "Vanguard 500 Index Fund Admiral Shares"),
    VINIX("VINIX", "Vanguard Institutional Index Fund"),
    VNQ("VNQ", "Vanguard Real Estate ETF"),
    VTSAX("VTSAX", "Vanguard Total Stock Market Index Fund Admiral Shares"),
    VTI("VTI", "Vanguard Total Stock Market ETF"),
    VTIAX("VTIAX", "Vanguard Total International Stock Index Fund Admiral Shares"),
    VOO("VOO", "Vanguard S&P 500 ETF"),
    VEA("VEA", "Vanguard FTSE Developed Markets ETF"),
    WMT("WMT", "Walmart Inc."),
    XLF("XLF", "State Street Financial Select Sector SPDR ETF"),
    XLE("XLE", "State Street Energy Select Sector SPDR ETF"),
    XLK("XLK", "State Street Technology Select Sector SPDR ETF"),
    XLU("XLU", "State Street Utilities Select Sector SPDR ETF"),
    XOM("XOM", "Exxon Mobil Corporation");

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