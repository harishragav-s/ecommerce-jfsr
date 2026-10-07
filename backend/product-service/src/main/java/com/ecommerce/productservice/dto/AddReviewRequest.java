package com.ecommerce.productservice.dto;

public class AddReviewRequest {
    private String productId;
    private String userId;
    private String userName;
    private String reviewMessage;
    private Double reviewValue;

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getReviewMessage() { return reviewMessage; }
    public void setReviewMessage(String reviewMessage) { this.reviewMessage = reviewMessage; }
    public Double getReviewValue() { return reviewValue; }
    public void setReviewValue(Double reviewValue) { this.reviewValue = reviewValue; }
}
