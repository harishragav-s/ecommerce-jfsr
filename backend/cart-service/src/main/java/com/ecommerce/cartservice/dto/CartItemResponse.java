package com.ecommerce.cartservice.dto;

public class CartItemResponse {
    private String productId;
    private String image;
    private String title;
    private Double price;
    private Double salePrice;
    private Integer quantity;

    public CartItemResponse() {}
    public CartItemResponse(String productId, String image, String title, Double price, Double salePrice, Integer quantity) {
        this.productId = productId;
        this.image = image;
        this.title = title;
        this.price = price;
        this.salePrice = salePrice;
        this.quantity = quantity;
    }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Double getSalePrice() { return salePrice; }
    public void setSalePrice(Double salePrice) { this.salePrice = salePrice; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
