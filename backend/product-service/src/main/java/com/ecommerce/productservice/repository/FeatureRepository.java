package com.ecommerce.productservice.repository;

import com.ecommerce.productservice.model.Feature;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FeatureRepository extends MongoRepository<Feature, String> {
}
