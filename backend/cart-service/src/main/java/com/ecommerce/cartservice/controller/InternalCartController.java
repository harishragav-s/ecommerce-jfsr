package com.ecommerce.cartservice.controller;

import com.ecommerce.cartservice.dto.ApiResponse;
import com.ecommerce.cartservice.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/internal/carts")
public class InternalCartController {

    private final CartService cartService;

    public InternalCartController(CartService cartService) {
        this.cartService = cartService;
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<ApiResponse<Void>> deleteCartById(@PathVariable String cartId) {
        boolean deleted = cartService.deleteCartById(cartId);
        if (!deleted) {
            return ResponseEntity.status(404).body(ApiResponse.fail("Cart not found"));
        }
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
