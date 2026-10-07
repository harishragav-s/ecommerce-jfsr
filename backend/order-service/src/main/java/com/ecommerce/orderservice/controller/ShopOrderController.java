package com.ecommerce.orderservice.controller;

import com.ecommerce.orderservice.dto.ApiResponse;
import com.ecommerce.orderservice.dto.CapturePaymentRequest;
import com.ecommerce.orderservice.dto.CreateOrderRequest;
import com.ecommerce.orderservice.model.Order;
import com.ecommerce.orderservice.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/shop/order")
public class ShopOrderController {

    private final OrderService orderService;

    public ShopOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody CreateOrderRequest request) {
        OrderService.CreateOrderResult result = orderService.createOrder(request);
        return ResponseEntity.status(201).body(Map.of(
                "success", true,
                "approvalURL", result.approvalURL,
                "orderId", result.orderId
        ));
    }

    @PostMapping("/capture")
    public ResponseEntity<ApiResponse<Order>> capturePayment(@RequestBody CapturePaymentRequest request) {
        OrderService.CaptureResult result = orderService.capturePayment(request);
        ApiResponse<Order> body = result.success
                ? ApiResponse.ok(result.message, result.order)
                : ApiResponse.fail(result.message);
        return ResponseEntity.status(result.status).body(body);
    }

    @GetMapping("/list/{userId}")
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrdersByUser(@PathVariable String userId) {
        List<Order> orders = orderService.getAllOrdersByUser(userId);
        if (orders.isEmpty()) {
            return ResponseEntity.status(404).body(ApiResponse.fail("No orders found!"));
        }
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<ApiResponse<Order>> getOrderDetails(@PathVariable String id) {
        Optional<Order> order = orderService.getOrderDetails(id);
        if (order.isEmpty()) {
            return ResponseEntity.status(404).body(ApiResponse.fail("Order not found!"));
        }
        return ResponseEntity.ok(ApiResponse.ok(order.get()));
    }
}
