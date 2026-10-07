package com.ecommerce.productservice.controller;

import com.ecommerce.productservice.dto.AddReviewRequest;
import com.ecommerce.productservice.dto.ApiResponse;
import com.ecommerce.productservice.model.ProductReview;
import com.ecommerce.productservice.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shop/review")
public class ShopReviewController {

    private final ReviewService reviewService;

    public ShopReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<ProductReview>> addProductReview(@RequestBody AddReviewRequest request) {
        ReviewService.Result result = reviewService.addProductReview(request);
        ApiResponse<ProductReview> body = result.success
                ? ApiResponse.ok(result.data)
                : ApiResponse.fail(result.message);
        return ResponseEntity.status(result.status).body(body);
    }

    @GetMapping("/{productId}")
    public ApiResponse<List<ProductReview>> getProductReviews(@PathVariable String productId) {
        return ApiResponse.ok(reviewService.getProductReviews(productId));
    }
}
