package com.ecommerce.productservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "productreviews")
public class ProductReview {

    @Id
    private String id;

    /** The React frontend was written for a Mongoose backend and reads `_id`; expose both. */
    public String get_id() {
        return id;
    }

    private String productId;
    private String userId;
    private String userName;
    private String reviewMessage;
    private Double reviewValue;

    @CreatedDate
    private Instant createdAt;
}
