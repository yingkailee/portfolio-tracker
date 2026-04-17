package com.yingkai.financial.portfolio_tracker_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "funds")
public class Fund {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String ticker;

    private String name;

    private Double averageAnnualYield;

    private String description;

    private Double weight = 0.0;

    public Fund() {}

    public Fund(Long id, String ticker, String name, Double averageAnnualYield, String description, Double weight) {
        this.id = id;
        this.ticker = ticker;
        this.name = name;
        this.averageAnnualYield = averageAnnualYield;
        this.description = description;
        this.weight = weight;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTicker() { return ticker; }
    public void setTicker(String ticker) { this.ticker = ticker; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Double getAverageAnnualYield() { return averageAnnualYield; }
    public void setAverageAnnualYield(Double averageAnnualYield) { this.averageAnnualYield = averageAnnualYield; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }
}
