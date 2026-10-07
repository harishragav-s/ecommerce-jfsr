package com.ecommerce.productservice.controller;

import com.ecommerce.productservice.dto.ApiResponse;
import com.ecommerce.productservice.model.Product;
import com.ecommerce.productservice.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/shop/products")
public class ShopProductController {

    private final ProductService productService;

    public ShopProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/get")
    public ApiResponse<List<Product>> getFilteredProducts(
            @RequestParam(required = false, defaultValue = "") String category,
            @RequestParam(required = false, defaultValue = "") String brand,
            @RequestParam(required = false, defaultValue = "price-lowtohigh") String sortBy) {
        return ApiResponse.ok(productService.getFilteredProducts(category, brand, sortBy));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<ApiResponse<Product>> getProductDetails(@PathVariable String id) {
        Optional<Product> product = productService.getProductDetails(id);
        if (product.isEmpty()) {
            return ResponseEntity.status(404).body(ApiResponse.fail("Product not found!"));
        }
        return ResponseEntity.ok(ApiResponse.ok(product.get()));
    }
}
