package com.ecommerce.orderservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order {

    @Id
    private String id;

    /** The React frontend was written for a Mongoose backend and reads `_id`; expose both. */
    public String get_id() {
        return id;
    }

    private String userId;
    private String cartId;
    private List<OrderCartItem> cartItems;
    private OrderAddressInfo addressInfo;

    private String orderStatus;
    private String paymentMethod;
    private String paymentStatus;
    private Double totalAmount;

    private Instant orderDate;
    private Instant orderUpdateDate;

    private String paymentId;
    private String payerId;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderCartItem {
        private String productId;
        private String title;
        private String image;
        private Double price;
        private Integer quantity;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderAddressInfo {
        private String addressId;
        private String address;
        private String city;
        private String pincode;
        private String phone;
        private String notes;
    }
}
