package com.ecommerce.cartservice.client;

import com.ecommerce.cartservice.dto.ApiResponse;
import com.ecommerce.cartservice.dto.ProductDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "product-service", fallback = ProductClientFallback.class)
public interface ProductClient {

    @GetMapping("/api/shop/products/get/{id}")
    ApiResponse<ProductDto> getProduct(@PathVariable("id") String id);
}
