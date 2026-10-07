package com.ecommerce.productservice.controller;

import com.ecommerce.productservice.dto.ApiResponse;
import com.ecommerce.productservice.model.Product;
import com.ecommerce.productservice.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/internal/products")
public class InternalProductController {

    private final ProductService productService;

    public InternalProductController(ProductService productService) {
        this.productService = productService;
    }

    @PutMapping("/{id}/decrement-stock")
    public ResponseEntity<ApiResponse<Product>> decrementStock(
            @PathVariable String id, @RequestParam int quantity) {
        Optional<Product> updated = productService.decrementStock(id, quantity);
        if (updated.isEmpty()) {
            return ResponseEntity.status(404).body(ApiResponse.fail("Product not found"));
        }
        return ResponseEntity.ok(ApiResponse.ok(updated.get()));
    }
}
