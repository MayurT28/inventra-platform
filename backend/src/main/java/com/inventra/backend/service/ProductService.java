package com.inventra.backend.service;

import com.inventra.backend.entity.Product;
import com.inventra.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Add product
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    // Delete product
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    // Update product
    public Product updateProduct(Long id, Product updatedProduct) {

        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        existingProduct.setName(updatedProduct.getName());
        existingProduct.setCategory(updatedProduct.getCategory());
        existingProduct.setQuantity(updatedProduct.getQuantity());
        existingProduct.setPrice(updatedProduct.getPrice());

        return productRepository.save(existingProduct);
    }
}