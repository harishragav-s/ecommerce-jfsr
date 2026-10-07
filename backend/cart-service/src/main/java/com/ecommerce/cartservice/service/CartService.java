package com.ecommerce.cartservice.service;

import com.ecommerce.cartservice.client.ProductClient;
import com.ecommerce.cartservice.dto.ApiResponse;
import com.ecommerce.cartservice.dto.CartItemResponse;
import com.ecommerce.cartservice.dto.CartResponse;
import com.ecommerce.cartservice.dto.ProductDto;
import com.ecommerce.cartservice.model.Cart;
import com.ecommerce.cartservice.repository.CartRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductClient productClient;

    public CartService(CartRepository cartRepository, ProductClient productClient) {
        this.cartRepository = cartRepository;
        this.productClient = productClient;
    }

    public static class Result<T> {
        public boolean success;
        public String message;
        public int status;
        public T data;

        public Result(boolean success, String message, int status, T data) {
            this.success = success;
            this.message = message;
            this.status = status;
            this.data = data;
        }
    }

    private Optional<ProductDto> fetchProduct(String productId) {
        try {
            ApiResponse<ProductDto> response = productClient.getProduct(productId);
            if (response != null && response.isSuccess() && response.getData() != null) {
                return Optional.of(response.getData());
            }
            return Optional.empty();
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Result<CartResponse> addToCart(String userId, String productId, Integer quantity) {
        if (userId == null || productId == null || quantity == null || quantity <= 0) {
            return new Result<>(false, "Invalid data provided!", 400, null);
        }

        if (fetchProduct(productId).isEmpty()) {
            return new Result<>(false, "Product not found", 404, null);
        }

        Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> {
            Cart c = new Cart();
            c.setUserId(userId);
            c.setItems(new ArrayList<>());
            return c;
        });

        int existingIndex = -1;
        for (int i = 0; i < cart.getItems().size(); i++) {
            if (cart.getItems().get(i).getProductId().equals(productId)) {
                existingIndex = i;
                break;
            }
        }

        if (existingIndex == -1) {
            cart.getItems().add(new Cart.CartItem(productId, quantity));
        } else {
            Cart.CartItem item = cart.getItems().get(existingIndex);
            item.setQuantity(item.getQuantity() + quantity);
        }

        Cart saved = cartRepository.save(cart);
        return new Result<>(true, null, 200, populate(saved));
    }

    public Result<CartResponse> fetchCartItems(String userId) {
        if (userId == null || userId.isBlank()) {
            return new Result<>(false, "User id is manadatory!", 400, null);
        }

        Optional<Cart> cartOpt = cartRepository.findByUserId(userId);
        if (cartOpt.isEmpty()) {
            return new Result<>(false, "Cart not found!", 404, null);
        }

        Cart cart = cartOpt.get();

        List<Cart.CartItem> validItems = new ArrayList<>();
        for (Cart.CartItem item : cart.getItems()) {
            if (fetchProduct(item.getProductId()).isPresent()) {
                validItems.add(item);
            }
        }
        if (validItems.size() < cart.getItems().size()) {
            cart.setItems(validItems);
            cartRepository.save(cart);
        }

        return new Result<>(true, null, 200, populate(cart));
    }

    public Result<CartResponse> updateCartItemQty(String userId, String productId, Integer quantity) {
        if (userId == null || productId == null || quantity == null || quantity <= 0) {
            return new Result<>(false, "Invalid data provided!", 400, null);
        }

        Optional<Cart> cartOpt = cartRepository.findByUserId(userId);
        if (cartOpt.isEmpty()) {
            return new Result<>(false, "Cart not found!", 404, null);
        }
        Cart cart = cartOpt.get();

        Cart.CartItem target = null;
        for (Cart.CartItem item : cart.getItems()) {
            if (item.getProductId().equals(productId)) {
                target = item;
                break;
            }
        }
        if (target == null) {
            return new Result<>(false, "Cart item not present !", 404, null);
        }

        target.setQuantity(quantity);
        Cart saved = cartRepository.save(cart);
        return new Result<>(true, null, 200, populate(saved));
    }

    public Result<CartResponse> deleteCartItem(String userId, String productId) {
        if (userId == null || productId == null) {
            return new Result<>(false, "Invalid data provided!", 400, null);
        }

        Optional<Cart> cartOpt = cartRepository.findByUserId(userId);
        if (cartOpt.isEmpty()) {
            return new Result<>(false, "Cart not found!", 404, null);
        }
        Cart cart = cartOpt.get();

        List<Cart.CartItem> remaining = new ArrayList<>();
        for (Cart.CartItem item : cart.getItems()) {
            if (!item.getProductId().equals(productId)) {
                remaining.add(item);
            }
        }
        cart.setItems(remaining);
        Cart saved = cartRepository.save(cart);
        return new Result<>(true, null, 200, populate(saved));
    }

    public boolean deleteCartById(String cartId) {
        if (!cartRepository.existsById(cartId)) return false;
        cartRepository.deleteById(cartId);
        return true;
    }

    private CartResponse populate(Cart cart) {
        List<CartItemResponse> items = new ArrayList<>();
        for (Cart.CartItem item : cart.getItems()) {
            Optional<ProductDto> productOpt = fetchProduct(item.getProductId());
            if (productOpt.isPresent()) {
                ProductDto p = productOpt.get();
                items.add(new CartItemResponse(p.getId(), p.getImage(), p.getTitle(), p.getPrice(), p.getSalePrice(), item.getQuantity()));
            } else {
                items.add(new CartItemResponse(null, null, "Product not found", null, null, item.getQuantity()));
            }
        }
        return new CartResponse(cart.getId(), cart.getUserId(), items);
    }
}
