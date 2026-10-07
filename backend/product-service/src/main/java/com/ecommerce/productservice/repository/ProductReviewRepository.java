package com.ecommerce.productservice.repository;

import com.ecommerce.productservice.model.ProductReview;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ProductReviewRepository extends MongoRepository<ProductReview, String> {
    List<ProductReview> findByProductId(String productId);
    Optional<ProductReview> findByProductIdAndUserId(String productId, String userId);
}
