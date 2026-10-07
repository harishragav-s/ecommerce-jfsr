package com.ecommerce.productservice.controller;

import com.ecommerce.productservice.dto.ApiResponse;
import com.ecommerce.productservice.model.Product;
import com.ecommerce.productservice.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/products")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {

    private final ProductService productService;

    public AdminProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<Product>> addProduct(@RequestBody Product product) {
        Product saved = productService.addProduct(product);
        return ResponseEntity.status(201).body(ApiResponse.ok(saved));
    }

    @GetMapping("/get")
    public ApiResponse<List<Product>> getAllProducts() {
        return ApiResponse.ok(productService.getAllProducts());
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<ApiResponse<Product>> editProduct(@PathVariable String id, @RequestBody Product product) {
        Optional<Product> updated = productService.editProduct(id, product);
        if (updated.isEmpty()) {
            return ResponseEntity.status(404).body(ApiResponse.fail("Product not found"));
        }
        return ResponseEntity.ok(ApiResponse.ok(updated.get()));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable String id) {
        boolean deleted = productService.deleteProduct(id);
        if (!deleted) {
            return ResponseEntity.status(404).body(ApiResponse.fail("Product not found"));
        }
        return ResponseEntity.ok(ApiResponse.okMessage("Product deleted successfully"));
    }
}
