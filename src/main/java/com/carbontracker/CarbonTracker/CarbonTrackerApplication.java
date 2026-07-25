package com.carbontracker.CarbonTracker;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableCaching
public class CarbonTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(CarbonTrackerApplication.class, args);
    }

    @Bean
    CommandLineRunner test(CacheManager cacheManager) {
        return args -> {
            System.out.println("CACHE MANAGER = " + cacheManager.getClass().getName());
        };
    }
}