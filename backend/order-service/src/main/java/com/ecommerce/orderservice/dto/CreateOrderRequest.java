package com.ecommerce.orderservice.dto;

import com.ecommerce.orderservice.model.Order;

import java.time.Instant;
import java.util.List;

public class CreateOrderRequest {
    private String userId;
    private String cartId;
    private List<Order.OrderCartItem> cartItems;
    private Order.OrderAddressInfo addressInfo;
    private String orderStatus;
    private String paymentMethod;
    private String paymentStatus;
    private Double totalAmount;
    private Instant orderDate;
    private Instant orderUpdateDate;
    private String paymentId;
    private String payerId;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getCartId() { return cartId; }
    public void setCartId(String cartId) { this.cartId = cartId; }
    public List<Order.OrderCartItem> getCartItems() { return cartItems; }
    public void setCartItems(List<Order.OrderCartItem> cartItems) { this.cartItems = cartItems; }
    public Order.OrderAddressInfo getAddressInfo() { return addressInfo; }
    public void setAddressInfo(Order.OrderAddressInfo addressInfo) { this.addressInfo = addressInfo; }
    public String getOrderStatus() { return orderStatus; }
    public void setOrderStatus(String orderStatus) { this.orderStatus = orderStatus; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public Instant getOrderDate() { return orderDate; }
    public void setOrderDate(Instant orderDate) { this.orderDate = orderDate; }
    public Instant getOrderUpdateDate() { return orderUpdateDate; }
    public void setOrderUpdateDate(Instant orderUpdateDate) { this.orderUpdateDate = orderUpdateDate; }
    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }
    public String getPayerId() { return payerId; }
    public void setPayerId(String payerId) { this.payerId = payerId; }
}
