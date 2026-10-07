package com.ecommerce.cartservice.controller;

import com.ecommerce.cartservice.dto.AddToCartRequest;
import com.ecommerce.cartservice.dto.ApiResponse;
import com.ecommerce.cartservice.dto.CartResponse;
import com.ecommerce.cartservice.dto.UpdateCartQtyRequest;
import com.ecommerce.cartservice.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shop/cart")
public class ShopCartController {

    private final CartService cartService;

    public ShopCartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(@RequestBody AddToCartRequest request) {
        return toResponse(cartService.addToCart(request.getUserId(), request.getProductId(), request.getQuantity()));
    }

    @GetMapping("/get/{userId}")
    public ResponseEntity<ApiResponse<CartResponse>> fetchCartItems(@PathVariable String userId) {
        return toResponse(cartService.fetchCartItems(userId));
    }

    @PutMapping("/update-cart")
    public ResponseEntity<ApiResponse<CartResponse>> updateCartItemQty(@RequestBody UpdateCartQtyRequest request) {
        return toResponse(cartService.updateCartItemQty(request.getUserId(), request.getProductId(), request.getQuantity()));
    }

    @DeleteMapping("/{userId}/{productId}")
    public ResponseEntity<ApiResponse<CartResponse>> deleteCartItem(
            @PathVariable String userId, @PathVariable String productId) {
        return toResponse(cartService.deleteCartItem(userId, productId));
    }

    private ResponseEntity<ApiResponse<CartResponse>> toResponse(CartService.Result<CartResponse> result) {
        ApiResponse<CartResponse> body = result.success ? ApiResponse.ok(result.data) : ApiResponse.fail(result.message);
        return ResponseEntity.status(result.status).body(body);
    }
}
