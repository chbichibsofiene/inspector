package com.inspector.platform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableScheduling
@EnableAsync
@EnableCaching
public class InspectorPlatformApplication {

    public static void main(String[] args) {
        try {
            String dbUrl = System.getenv("SPRING_DATASOURCE_URL");
            System.out.println("=== DIAGNOSTIC STARTUP ===");
            System.out.println("DB URL defined: " + (dbUrl != null && !dbUrl.isEmpty()));
            if (dbUrl != null && dbUrl.length() > 10) {
                System.out.println("DB URL Prefix: " + dbUrl.substring(0, 15) + "...");
            }
            System.out.println("Server Port (Env): " + System.getenv("PORT"));
            System.out.println("==========================");
            
            SpringApplication.run(InspectorPlatformApplication.class, args);
        } catch (Exception e) {
            System.err.println("FATAL STARTUP ERROR:");
            e.printStackTrace();
            System.exit(1);
        }
    }
}

