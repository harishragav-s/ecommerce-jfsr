package com.ecommerce.productservice.service;

import com.ecommerce.productservice.model.Product;
import com.ecommerce.productservice.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock ProductRepository productRepository;
    @Mock MongoTemplate mongoTemplate;
    @InjectMocks ProductService productService;

    @Test
    void decrementStockReducesTotalStock() {
        Product product = new Product();
        product.setTotalStock(10);
        when(productRepository.findById("p1")).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArgument(0));
        assertThat(productService.decrementStock("p1", 3)).get().extracting(Product::getTotalStock).isEqualTo(7);
    }

    @Test
    void deleteProductReturnsFalseWhenMissing() {
        when(productRepository.existsById("x")).thenReturn(false);
        assertThat(productService.deleteProduct("x")).isFalse();
        verify(productRepository, never()).deleteById(any());
    }

    @Test
    void deleteProductDeletesWhenPresent() {
        when(productRepository.existsById("p1")).thenReturn(true);
        assertThat(productService.deleteProduct("p1")).isTrue();
        verify(productRepository).deleteById("p1");
    }
}
