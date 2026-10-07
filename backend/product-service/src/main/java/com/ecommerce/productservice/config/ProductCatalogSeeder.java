package com.ecommerce.productservice.config;

import com.ecommerce.productservice.model.Product;
import com.ecommerce.productservice.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/**
 * Keeps a starter catalogue in place on every start:
 *  - inserts any starter product that isn't there yet (matched by title)
 *  - replaces empty or placeholder (placehold.co) images on starter products
 * Products an admin created, and images an admin changed, are never touched.
 */
@Component
public class ProductCatalogSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(ProductCatalogSeeder.class);
    private static final String IMG = "https://images.unsplash.com/photo-%s?auto=format&fit=crop&w=800&q=80";

    private final ProductRepository productRepository;

    public ProductCatalogSeeder(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        int inserted = 0;
        int reimaged = 0;
        for (Product starter : catalog()) {
            Optional<Product> existing = productRepository.findFirstByTitle(starter.getTitle());
            if (existing.isEmpty()) {
                productRepository.save(starter);
                inserted++;
            } else {
                Product p = existing.get();
                if (p.getImage() == null || p.getImage().isBlank() || p.getImage().contains("placehold.co")) {
                    p.setImage(starter.getImage());
                    productRepository.save(p);
                    reimaged++;
                }
            }
        }
        log.info("Catalogue seed: {} inserted, {} placeholder images replaced.", inserted, reimaged);
    }

    static List<Product> catalog() {
        return List.of(
                p("1542291026-7eec264c27ff", "Nike Air Max Running Shoes", "Lightweight running shoes with responsive Air cushioning for everyday training.", "footwear", "nike", 7999, 6499, 40),
                p("1521572163474-6864f9cf17ab", "Nike Dri-FIT Training Tee", "Moisture-wicking t-shirt built for high-intensity workouts.", "men", "nike", 1799, 1399, 60),
                p("1503944583220-79d8926ad5e2", "Nike Kids Sport Shorts", "Breathable shorts for active kids with an elastic waistband.", "kids", "nike", 1299, 999, 35),
                p("1588850561407-ed78c282e89b", "Nike Sportswear Cap", "Adjustable cotton cap with embroidered logo.", "accessories", "nike", 999, 799, 50),

                p("1595950653106-6c9ebd614d3a", "Adidas Ultraboost Sneakers", "Energy-returning Boost midsole for all-day comfort.", "footwear", "adidas", 8999, 7499, 30),
                p("1556821840-3a63f95609a7", "Adidas Originals Hoodie", "Classic hoodie in soft brushed fleece.", "men", "adidas", 3999, 3199, 40),
                p("1506629082955-511b1aa562c8", "Adidas Women's Track Pants", "Tapered-fit track pants with side stripe detailing.", "women", "adidas", 2999, 2399, 45),
                p("1553062407-98eeb64c6a62", "Adidas Duffel Gym Bag", "Spacious bag with a separate shoe compartment.", "accessories", "adidas", 2799, 2299, 20),

                p("1549298916-b41d501d3772", "Puma Suede Classic Sneakers", "Timeless suede sneakers with a rubber cupsole.", "footwear", "puma", 5499, 4599, 35),
                p("1586363104862-3a5e2ab60d99", "Puma Essentials Polo Shirt", "Classic-fit polo in soft pique cotton.", "men", "puma", 1999, 1599, 50),
                p("1515886657613-9f3515b0c78f", "Puma Women's Leggings", "High-waist leggings with four-way stretch fabric.", "women", "puma", 2299, 1799, 40),
                p("1523275335684-37898b6baf30", "Puma Sports Watch", "Water-resistant digital sports watch with stopwatch.", "accessories", "puma", 3499, 2799, 15),

                p("1542272604-787c3835535d", "Levi's 511 Slim Fit Jeans", "Slim-fit denim with classic five-pocket styling.", "men", "levi", 3999, 3199, 45),
                p("1576995853123-5a10305d93c0", "Levi's Trucker Denim Jacket", "Iconic denim jacket, a timeless wardrobe staple.", "men", "levi", 4999, 4199, 25),
                p("1541099649105-f69ad21f3246", "Levi's Women's High-Rise Jeans", "Flattering high-rise fit with stretch denim comfort.", "women", "levi", 3799, 2999, 35),
                p("1624222247344-550fb60583dc", "Levi's Classic Leather Belt", "Genuine leather belt with signature buckle.", "accessories", "levi", 1499, 1199, 30),

                p("1591047139829-d91aecb6caea", "Zara Oversized Blazer", "Tailored oversized blazer for a modern silhouette.", "women", "zara", 5999, 4799, 20),
                p("1595777457583-95e059d581b8", "Zara Floral Midi Dress", "Flowy midi dress with an all-over floral print.", "women", "zara", 4499, 3599, 25),
                p("1596755094514-f87e34085b2c", "Zara Slim Fit Shirt", "Crisp cotton shirt with a tailored slim fit.", "men", "zara", 2999, 2399, 35),
                p("1584917865442-de89df76afd3", "Zara Structured Handbag", "Structured handbag with gold-tone hardware.", "accessories", "zara", 3499, 2799, 15),

                p("1576566588028-4147f3842f27", "H&M Basic Crew Neck Tee", "Everyday cotton t-shirt in a relaxed fit.", "men", "h&m", 799, 599, 70),
                p("1576871337622-98d48d1cf531", "H&M Women's Knit Sweater", "Soft knit sweater, perfect for layering.", "women", "h&m", 1999, 1599, 40),
                p("1519238263530-99bdd11df2ea", "H&M Kids Cotton Pajama Set", "Soft cotton pajama set with fun prints.", "kids", "h&m", 999, 799, 45),
                p("1576871337632-b9aef4c17ab9", "H&M Beanie Hat", "Ribbed knit beanie for cold weather.", "accessories", "h&m", 599, 449, 60)
        );
    }

    private static Product p(String photoId, String title, String description, String category,
                             String brand, double price, double salePrice, int stock) {
        Product product = new Product();
        product.setImage(String.format(IMG, photoId));
        product.setTitle(title);
        product.setDescription(description);
        product.setCategory(category);
        product.setBrand(brand);
        product.setPrice(price);
        product.setSalePrice(salePrice);
        product.setTotalStock(stock);
        product.setAverageReview(0.0);
        return product;
    }
}
