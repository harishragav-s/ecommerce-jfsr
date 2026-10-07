package com.ecommerce.productservice.controller;

import com.ecommerce.productservice.dto.ApiResponse;
import com.ecommerce.productservice.model.Product;
import com.ecommerce.productservice.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shop/search")
public class ShopSearchController {

    private final ProductService productService;

    public ShopSearchController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/{keyword}")
    public ResponseEntity<ApiResponse<List<Product>>> search(@PathVariable String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("Keyword is required and must be in string format"));
        }
        return ResponseEntity.ok(ApiResponse.ok(productService.searchProducts(keyword)));
    }
}
