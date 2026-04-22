package com.yingkai.financial.portfolio_tracker_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "funds")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Fund {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String ticker;

    private String name;
}
