package com.ecommerce.orderservice.client;

import com.ecommerce.orderservice.dto.ApiResponse;
import com.ecommerce.orderservice.dto.ProductDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "product-service", fallback = ProductClientFallback.class)
public interface ProductClient {

    @PutMapping("/internal/products/{id}/decrement-stock")
    ApiResponse<ProductDto> decrementStock(@PathVariable("id") String id, @RequestParam("quantity") int quantity);
}
