package com.ecommerce.productservice.client;

import com.ecommerce.productservice.dto.ApiResponse;
import com.ecommerce.productservice.dto.OrderSummaryDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "order-service", fallback = OrderClientFallback.class)
public interface OrderClient {

    @GetMapping("/internal/orders/{userId}")
    ApiResponse<List<OrderSummaryDto>> getOrdersByUser(@PathVariable("userId") String userId);
}
