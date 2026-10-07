package com.ecommerce.productservice.client;

import com.ecommerce.productservice.dto.ApiResponse;
import com.ecommerce.productservice.dto.OrderSummaryDto;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class OrderClientFallback implements OrderClient {

    @Override
    public ApiResponse<List<OrderSummaryDto>> getOrdersByUser(String userId) {
        return ApiResponse.ok(Collections.<OrderSummaryDto>emptyList());
    }
}
