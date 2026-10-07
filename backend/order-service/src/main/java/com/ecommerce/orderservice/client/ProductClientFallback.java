package com.ecommerce.orderservice.client;

import com.ecommerce.orderservice.dto.ApiResponse;
import com.ecommerce.orderservice.dto.ProductDto;
import org.springframework.stereotype.Component;

@Component
public class ProductClientFallback implements ProductClient {

    @Override
    public ApiResponse<ProductDto> decrementStock(String id, int quantity) {
        return ApiResponse.fail("product-service unavailable");
    }
}
