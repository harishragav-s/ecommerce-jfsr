package com.ecommerce.gateway.config;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * First line of defence, mirroring BizKredit's JwtAuthGatewayFilter.
 * Anonymous access is allowed only to login/register and to read-only
 * catalogue browsing; every other route needs a valid token. Each service
 * then applies its own, finer rules (e.g. admin-only endpoints).
 */
@Component
public class JwtAuthGatewayFilter implements GlobalFilter, Ordered {

    private static final List<String> PUBLIC = List.of("/api/auth/");
    private static final List<String> PUBLIC_GET = List.of(
            "/api/shop/products/", "/api/shop/search/", "/api/shop/review/", "/api/common/feature/");

    private final JwtUtil jwtUtil;

    public JwtAuthGatewayFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();

        boolean preflight = HttpMethod.OPTIONS.equals(request.getMethod());
        boolean open = PUBLIC.stream().anyMatch(path::startsWith)
                || (HttpMethod.GET.equals(request.getMethod()) && PUBLIC_GET.stream().anyMatch(path::startsWith));

        if (preflight || open) {
            return chain.filter(exchange);
        }

        String token = extractToken(request);
        if (token == null || !jwtUtil.isTokenValid(token)) {
            return unauthorized(exchange.getResponse());
        }
        return chain.filter(exchange);
    }

    private String extractToken(ServerHttpRequest request) {
        String header = request.getHeaders().getFirst("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        HttpCookie cookie = request.getCookies().getFirst("token");
        return cookie != null ? cookie.getValue() : null;
    }

    private Mono<Void> unauthorized(ServerHttpResponse response) {
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        byte[] body = "{\"success\":false,\"message\":\"Please log in to continue\"}".getBytes(StandardCharsets.UTF_8);
        DataBuffer buffer = response.bufferFactory().wrap(body);
        return response.writeWith(Mono.just(buffer));
    }

    @Override
    public int getOrder() {
        return -1;
    }
}
