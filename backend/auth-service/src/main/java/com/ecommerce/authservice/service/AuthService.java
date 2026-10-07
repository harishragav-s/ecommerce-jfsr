package com.ecommerce.authservice.service;

import com.ecommerce.authservice.dto.LoginRequest;
import com.ecommerce.authservice.dto.RegisterRequest;
import com.ecommerce.authservice.model.User;
import com.ecommerce.authservice.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public static class AuthResult {
        public boolean success;
        public String message;
        public User user;

        public AuthResult(boolean success, String message, User user) {
            this.success = success;
            this.message = message;
            this.user = user;
        }
    }

    public AuthResult register(RegisterRequest request) {
        Optional<User> existing = userRepository.findByEmail(request.getEmail());
        if (existing.isPresent()) {
            return new AuthResult(false, "User Already exists with the same email! Please try again", null);
        }

        User newUser = new User();
        newUser.setUserName(request.getUserName());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setRole("USER");

        userRepository.save(newUser);
        return new AuthResult(true, "Registration successful", newUser);
    }

    public AuthResult login(LoginRequest request) {
        Optional<User> found = userRepository.findByEmail(request.getEmail());
        if (found.isEmpty()) {
            return new AuthResult(false, "User doesn't exists! Please register first", null);
        }

        User user = found.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthResult(false, "Incorrect password! Please try again", null);
        }

        return new AuthResult(true, "Logged in successfully", user);
    }
}
