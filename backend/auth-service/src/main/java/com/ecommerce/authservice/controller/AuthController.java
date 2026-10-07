package com.ecommerce.authservice.controller;

import com.ecommerce.authservice.config.JwtUtil;
import com.ecommerce.authservice.dto.ApiResponse;
import com.ecommerce.authservice.dto.LoginRequest;
import com.ecommerce.authservice.dto.RegisterRequest;
import com.ecommerce.authservice.dto.UserResponse;
import com.ecommerce.authservice.model.User;
import com.ecommerce.authservice.service.AuthService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    @Value("${app.cookie.name}")
    private String cookieName;

    @Value("${app.cookie.secure}")
    private boolean cookieSecure;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ApiResponse<Void> register(@RequestBody RegisterRequest request) {
        AuthService.AuthResult result = authService.register(request);
        return result.success ? ApiResponse.okMessage(result.message) : ApiResponse.fail(result.message);
    }

    /**
     * The frontend's auth slice reads the logged-in user from a "user" field
     * (not the generic "data" field other endpoints use), so login and
     * check-auth return { success, message, user }.
     */
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        AuthService.AuthResult result = authService.login(request);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", result.success);
        body.put("message", result.message);
        if (!result.success) {
            return body;
        }

        User user = result.user;
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole());
        claims.put("email", user.getEmail());
        claims.put("userName", user.getUserName());
        String token = jwtUtil.generateToken(user.getId(), claims);

        response.addCookie(buildCookie(token, -1));
        body.put("user", new UserResponse(user.getId(), user.getEmail(), user.getUserName(), user.getRole(), token));
        return body;
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(HttpServletResponse response) {
        response.addCookie(buildCookie(null, 0));
        return ApiResponse.okMessage("Logged out successfully!");
    }

    @GetMapping("/check-auth")
    public ResponseEntity<Map<String, Object>> checkAuth(HttpServletRequest request) {
        String token = extractToken(request);
        Claims claims = token == null ? null : jwtUtil.parse(token);

        Map<String, Object> body = new LinkedHashMap<>();
        if (claims == null) {
            body.put("success", false);
            body.put("message", "Unauthorised user!");
            return ResponseEntity.status(401).body(body);
        }

        Map<String, Object> user = new LinkedHashMap<>();
        user.put("id", claims.getSubject());
        user.put("role", claims.get("role", String.class));
        user.put("email", claims.get("email", String.class));
        user.put("userName", claims.get("userName", String.class));

        body.put("success", true);
        body.put("message", "Authenticated user!");
        body.put("user", user);
        return ResponseEntity.ok(body);
    }

    private Cookie buildCookie(String value, int maxAge) {
        Cookie cookie = new Cookie(cookieName, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieSecure);
        cookie.setPath("/");
        cookie.setMaxAge(maxAge);
        return cookie;
    }

    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookieName.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
