package com.ecommerce.productservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class OrderSummaryDto {
    private String id;
    private String userId;
    private List<OrderCartItemDto> cartItems;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public List<OrderCartItemDto> getCartItems() { return cartItems; }
    public void setCartItems(List<OrderCartItemDto> cartItems) { this.cartItems = cartItems; }
}
