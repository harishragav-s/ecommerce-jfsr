package com.ecommerce.orderservice.client;

import org.springframework.stereotype.Component;

@Component
public class CartClientFallback implements CartClient {

    @Override
    public void deleteCartById(String cartId) {
    }
}
