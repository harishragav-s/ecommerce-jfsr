package com.ecommerce.productservice.controller;

import com.ecommerce.productservice.dto.AddFeatureRequest;
import com.ecommerce.productservice.dto.ApiResponse;
import com.ecommerce.productservice.model.Feature;
import com.ecommerce.productservice.service.FeatureService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/common/feature")
public class CommonFeatureController {

    private final FeatureService featureService;

    public CommonFeatureController(FeatureService featureService) {
        this.featureService = featureService;
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<Feature>> addFeatureImage(@RequestBody AddFeatureRequest request) {
        Feature saved = featureService.addFeatureImage(request.getImage());
        return ResponseEntity.status(201).body(ApiResponse.ok(saved));
    }

    @GetMapping("/get")
    public ApiResponse<List<Feature>> getFeatureImages() {
        return ApiResponse.ok(featureService.getFeatureImages());
    }
}
