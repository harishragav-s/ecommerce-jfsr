package com.ecommerce.orderservice.controller;

import com.ecommerce.orderservice.dto.ApiResponse;
import com.ecommerce.orderservice.model.Order;
import com.ecommerce.orderservice.service.OrderService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Service-to-service only: product-service calls this through Feign to check
 * a user bought a product before they can review it. Feign calls carry no
 * user token, so /internal/** is open in SecurityConfig; the gateway has no
 * route to it, so browsers can't reach it.
 */
@RestController
@RequestMapping("/internal/orders")
public class InternalOrderController {

    private final OrderService orderService;

    public InternalOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/{userId}")
    public ApiResponse<List<Order>> getOrdersByUser(@PathVariable String userId) {
        return ApiResponse.ok(orderService.getAllOrdersByUser(userId));
    }
}
