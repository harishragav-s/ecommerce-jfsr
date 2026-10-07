package com.ecommerce.productservice.service;

import com.ecommerce.productservice.model.Product;
import com.ecommerce.productservice.repository.ProductRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final MongoTemplate mongoTemplate;

    public ProductService(ProductRepository productRepository, MongoTemplate mongoTemplate) {
        this.productRepository = productRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public List<Product> getFilteredProducts(String category, String brand, String sortBy) {
        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        if (category != null && !category.isBlank()) {
            criteriaList.add(Criteria.where("category").in(Arrays.asList(category.split(","))));
        }
        if (brand != null && !brand.isBlank()) {
            criteriaList.add(Criteria.where("brand").in(Arrays.asList(brand.split(","))));
        }
        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        Sort sort = switch (sortBy == null ? "price-lowtohigh" : sortBy) {
            case "price-hightolow" -> Sort.by(Sort.Direction.DESC, "price");
            case "title-atoz" -> Sort.by(Sort.Direction.ASC, "title");
            case "title-ztoa" -> Sort.by(Sort.Direction.DESC, "title");
            default -> Sort.by(Sort.Direction.ASC, "price");
        };
        query.with(sort);

        return mongoTemplate.find(query, Product.class);
    }

    public Optional<Product> getProductDetails(String id) {
        return productRepository.findById(id);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    public Optional<Product> editProduct(String id, Product updates) {
        return productRepository.findById(id).map(existing -> {
            if (updates.getImage() != null) existing.setImage(updates.getImage());
            if (updates.getTitle() != null) existing.setTitle(updates.getTitle());
            if (updates.getDescription() != null) existing.setDescription(updates.getDescription());
            if (updates.getCategory() != null) existing.setCategory(updates.getCategory());
            if (updates.getBrand() != null) existing.setBrand(updates.getBrand());
            if (updates.getPrice() != null) existing.setPrice(updates.getPrice());
            existing.setSalePrice(updates.getSalePrice());
            if (updates.getTotalStock() != null) existing.setTotalStock(updates.getTotalStock());
            return productRepository.save(existing);
        });
    }

    public boolean deleteProduct(String id) {
        if (!productRepository.existsById(id)) return false;
        productRepository.deleteById(id);
        return true;
    }

    public List<Product> searchProducts(String keyword) {
        Criteria regexCriteria = new Criteria().orOperator(
                Criteria.where("title").regex(keyword, "i"),
                Criteria.where("description").regex(keyword, "i"),
                Criteria.where("category").regex(keyword, "i"),
                Criteria.where("brand").regex(keyword, "i")
        );
        Query query = new Query(regexCriteria);
        return mongoTemplate.find(query, Product.class);
    }

    public Optional<Product> decrementStock(String id, int quantity) {
        return productRepository.findById(id).map(product -> {
            product.setTotalStock(product.getTotalStock() - quantity);
            return productRepository.save(product);
        });
    }
}
