package com.yingkai.financial.portfolio_tracker_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PortfolioTrackerBackendApplication {

	public static void main(String[] args) {
		System.out.println("DB_URL: " + System.getenv("DB_URL"));
		System.out.println("DB_USER: " + System.getenv("DB_USER"));
		System.out.println("DB_PASSWORD: " + (System.getenv("DB_PASSWORD") != null ? "***" : "null"));
		SpringApplication.run(PortfolioTrackerBackendApplication.class, args);
	}

}
