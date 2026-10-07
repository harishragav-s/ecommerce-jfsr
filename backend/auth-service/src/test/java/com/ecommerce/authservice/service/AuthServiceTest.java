package com.ecommerce.authservice.service;

import com.ecommerce.authservice.dto.LoginRequest;
import com.ecommerce.authservice.dto.RegisterRequest;
import com.ecommerce.authservice.model.User;
import com.ecommerce.authservice.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock UserRepository userRepository;
    @Mock PasswordEncoder passwordEncoder;
    @InjectMocks AuthService authService;

    RegisterRequest register;
    LoginRequest login;

    @BeforeEach
    void setUp() {
        register = new RegisterRequest();
        register.setUserName("john");
        register.setEmail("john@test.com");
        register.setPassword("secret");
        login = new LoginRequest();
        login.setEmail("john@test.com");
        login.setPassword("secret");
    }

    @Test
    void registerRejectsDuplicateEmail() {
        when(userRepository.findByEmail("john@test.com")).thenReturn(Optional.of(new User()));
        assertThat(authService.register(register).success).isFalse();
        verify(userRepository, never()).save(any());
    }

    @Test
    void registerHashesPasswordAndSetsUserRole() {
        when(userRepository.findByEmail("john@test.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("secret")).thenReturn("hashed");
        AuthService.AuthResult result = authService.register(register);
        assertThat(result.success).isTrue();
        assertThat(result.user.getPassword()).isEqualTo("hashed");
        assertThat(result.user.getRole()).isEqualTo("USER");
    }

    @Test
    void loginFailsForUnknownEmail() {
        when(userRepository.findByEmail("john@test.com")).thenReturn(Optional.empty());
        assertThat(authService.login(login).success).isFalse();
    }

    @Test
    void loginFailsForWrongPassword() {
        User user = new User();
        user.setPassword("hashed");
        when(userRepository.findByEmail("john@test.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("secret", "hashed")).thenReturn(false);
        assertThat(authService.login(login).success).isFalse();
    }

    @Test
    void loginSucceeds() {
        User user = new User();
        user.setPassword("hashed");
        when(userRepository.findByEmail("john@test.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("secret", "hashed")).thenReturn(true);
        assertThat(authService.login(login).user).isSameAs(user);
    }
}
