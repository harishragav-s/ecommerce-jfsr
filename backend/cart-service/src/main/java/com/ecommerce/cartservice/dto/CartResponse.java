package com.ecommerce.cartservice.dto;

import java.util.List;

public class CartResponse {
    private String _id;
    private String userId;
    private List<CartItemResponse> items;

    public CartResponse() {}
    public CartResponse(String _id, String userId, List<CartItemResponse> items) {
        this._id = _id;
        this.userId = userId;
        this.items = items;
    }

    public String get_id() { return _id; }
    public void set_id(String _id) { this._id = _id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public List<CartItemResponse> getItems() { return items; }
    public void setItems(List<CartItemResponse> items) { this.items = items; }
}
