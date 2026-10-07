package com.ecommerce.productservice.service;

import com.ecommerce.productservice.model.Feature;
import com.ecommerce.productservice.repository.FeatureRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeatureService {

    private final FeatureRepository featureRepository;

    public FeatureService(FeatureRepository featureRepository) {
        this.featureRepository = featureRepository;
    }

    public Feature addFeatureImage(String image) {
        Feature feature = new Feature();
        feature.setImage(image);
        return featureRepository.save(feature);
    }

    public List<Feature> getFeatureImages() {
        return featureRepository.findAll();
    }
}
