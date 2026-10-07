package com.ecommerce.orderservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaypalService {

    @Value("${app.frontend.base-url:http://localhost:5173}")
    private String frontendBaseUrl;

    public String createApprovalUrl(String orderId) {
        return frontendBaseUrl + "/shop/paypal-return?token=" + orderId;
    }
}
