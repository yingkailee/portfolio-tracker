package com.yingkai.financial.portfolio_tracker_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PortfolioTrackerBackendApplication {

	public static void main(String[] args) {
		String url = System.getenv("DB_URL");
		String user = System.getenv("DB_USER");
		String pass = System.getenv("DB_PASSWORD");
		System.out.println("ENV DB_URL: " + url);
		System.out.println("ENV DB_USER: " + user);
		System.out.println("ENV DB_PASSWORD: " + (pass != null ? "set" : "null"));
		SpringApplication.run(PortfolioTrackerBackendApplication.class, args);
	}

}
