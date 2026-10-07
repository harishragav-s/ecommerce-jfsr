package com.ecommerce.productservice.service;

import com.ecommerce.productservice.client.OrderClient;
import com.ecommerce.productservice.dto.AddReviewRequest;
import com.ecommerce.productservice.dto.ApiResponse;
import com.ecommerce.productservice.dto.OrderSummaryDto;
import com.ecommerce.productservice.model.Product;
import com.ecommerce.productservice.model.ProductReview;
import com.ecommerce.productservice.repository.ProductRepository;
import com.ecommerce.productservice.repository.ProductReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    private final ProductRepository productRepository;
    private final ProductReviewRepository reviewRepository;
    private final OrderClient orderClient;

    public ReviewService(ProductRepository productRepository, ProductReviewRepository reviewRepository,
                          OrderClient orderClient) {
        this.productRepository = productRepository;
        this.reviewRepository = reviewRepository;
        this.orderClient = orderClient;
    }

    public static class Result {
        public boolean success;
        public String message;
        public int status;
        public ProductReview data;

        public Result(boolean success, String message, int status, ProductReview data) {
            this.success = success;
            this.message = message;
            this.status = status;
            this.data = data;
        }
    }

    public Result addProductReview(AddReviewRequest request) {
        ApiResponse<List<OrderSummaryDto>> ordersResponse = orderClient.getOrdersByUser(request.getUserId());
        List<OrderSummaryDto> orders = ordersResponse != null && ordersResponse.getData() != null
                ? ordersResponse.getData() : List.of();

        boolean purchased = orders.stream().anyMatch(order -> order.getCartItems() != null
                && order.getCartItems().stream().anyMatch(item -> request.getProductId().equals(item.getProductId())));

        if (!purchased) {
            return new Result(false, "You need to purchase product to review it.", 403, null);
        }

        Optional<ProductReview> existing = reviewRepository.findByProductIdAndUserId(
                request.getProductId(), request.getUserId());
        if (existing.isPresent()) {
            return new Result(false, "You already reviewed this product!", 400, null);
        }

        ProductReview review = new ProductReview();
        review.setProductId(request.getProductId());
        review.setUserId(request.getUserId());
        review.setUserName(request.getUserName());
        review.setReviewMessage(request.getReviewMessage());
        review.setReviewValue(request.getReviewValue());
        ProductReview saved = reviewRepository.save(review);

        List<ProductReview> allReviews = reviewRepository.findByProductId(request.getProductId());
        double average = allReviews.stream().mapToDouble(ProductReview::getReviewValue).average().orElse(0.0);

        productRepository.findById(request.getProductId()).ifPresent(product -> {
            product.setAverageReview(average);
            productRepository.save(product);
        });

        return new Result(true, null, 201, saved);
    }

    public List<ProductReview> getProductReviews(String productId) {
        return reviewRepository.findByProductId(productId);
    }
}
