package com.ecommerce.cartservice.client;

import com.ecommerce.cartservice.dto.ApiResponse;
import com.ecommerce.cartservice.dto.ProductDto;
import org.springframework.stereotype.Component;

@Component
public class ProductClientFallback implements ProductClient {

    @Override
    public ApiResponse<ProductDto> getProduct(String id) {
        return ApiResponse.fail("product-service unavailable");
    }
}
