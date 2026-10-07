package com.ecommerce.authservice.config;

import com.ecommerce.authservice.model.User;
import com.ecommerce.authservice.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminBootstrapSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminBootstrapSeeder.class);

    static final String DEFAULT_ADMIN_EMAIL = "admin@ecommerce.com";
    static final String DEFAULT_ADMIN_PASSWORD = "Admin@123";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminBootstrapSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.findByRole("ADMIN").isEmpty()) {
            log.info("Admin account already exists - skipping bootstrap seed.");
            return;
        }

        User admin = new User();
        admin.setUserName("admin");
        admin.setEmail(DEFAULT_ADMIN_EMAIL);
        admin.setPassword(passwordEncoder.encode(DEFAULT_ADMIN_PASSWORD));
        admin.setRole("ADMIN");
        userRepository.save(admin);

        log.warn("Default admin created - email: {}, password: {} (change it in a real deployment)",
                DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD);
    }
}
