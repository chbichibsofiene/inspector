package com.inspector.platform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class InspectorPlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(InspectorPlatformApplication.class, args);
    }
}

