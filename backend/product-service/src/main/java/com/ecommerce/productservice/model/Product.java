package com.ecommerce.productservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
public class Product {

    @Id
    private String id;

    /** The React frontend was written for a Mongoose backend and reads `_id`; expose both. */
    public String get_id() {
        return id;
    }

    private String image;
    private String title;
    private String description;
    private String category;
    private String brand;
    private Double price;
    private Double salePrice;
    private Integer totalStock;
    private Double averageReview;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
