package com.ecommerce.orderservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "cart-service", fallback = CartClientFallback.class)
public interface CartClient {

    @DeleteMapping("/internal/carts/{cartId}")
    void deleteCartById(@PathVariable("cartId") String cartId);
}
