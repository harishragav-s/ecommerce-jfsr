package com.ecommerce.orderservice.controller;

import com.ecommerce.orderservice.dto.ApiResponse;
import com.ecommerce.orderservice.model.Order;
import com.ecommerce.orderservice.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/orders")
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/get")
    public ApiResponse<List<Order>> getAllOrders() {
        return ApiResponse.ok(orderService.getAllOrders());
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<ApiResponse<Order>> getOrderDetails(@PathVariable String id) {
        Optional<Order> order = orderService.getOrderDetails(id);
        if (order.isEmpty()) {
            return ResponseEntity.status(404).body(ApiResponse.fail("Order not found!"));
        }
        return ResponseEntity.ok(ApiResponse.ok(order.get()));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
            @PathVariable String id, @RequestBody Map<String, String> body) {
        Optional<Order> updated = orderService.updateOrderStatus(id, body.get("orderStatus"));
        if (updated.isEmpty()) {
            return ResponseEntity.status(404).body(ApiResponse.fail("Order not found!"));
        }
        return ResponseEntity.ok(ApiResponse.ok("Order status is updated successfully!", updated.get()));
    }
}
