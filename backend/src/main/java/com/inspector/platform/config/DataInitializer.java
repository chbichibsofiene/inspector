package com.inspector.platform.config;

import com.inspector.platform.entity.Role;
import com.inspector.platform.entity.User;
import com.inspector.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String ADMIN_EMAIL = "admin@inspector.tn";

    @Override
    public void run(String... args) {
        if (userRepository.existsByEmail(ADMIN_EMAIL)) {
            log.info("Admin account already exists – skipping seed.");
            return;
        }

        User admin = User.builder()
                .email(ADMIN_EMAIL)
                .password(passwordEncoder.encode("Admin@2024"))
                .serialCode("ADMIN-0001")
                .role(Role.ADMIN)
                .enabled(true)
                .build();

        userRepository.save(admin);
        log.warn("=================================================================");
        log.warn(" DEFAULT ADMIN ACCOUNT CREATED");
        log.warn("   Email      : {}", ADMIN_EMAIL);
        log.warn("   Password   : Admin@2024");
        log.warn("   Serial Code: ADMIN-0001");
        log.warn(" ⚠️  Please change these credentials after first login!");
        log.warn("=================================================================");
    }
}

