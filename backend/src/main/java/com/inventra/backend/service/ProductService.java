package com.inventra.backend.service;

import com.inventra.backend.entity.Product;
import com.inventra.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;
import com.inventra.backend.dto.StockAdjustmentRequest;

@Service
public class ProductService {

        private final ProductRepository productRepository;
        private final InventoryTransactionService inventoryTransactionService;

        public ProductService(
                        ProductRepository productRepository,
                        InventoryTransactionService inventoryTransactionService) {
                this.productRepository = productRepository;
                this.inventoryTransactionService = inventoryTransactionService;
        }

        // Get all products
        public List<Product> getAllProducts() {
                return productRepository.findAllByOrderByUpdatedAtDesc();
        }

        // Add product
        public Product addProduct(Product product) {

                boolean exists =
                        productRepository
                                .existsByNameIgnoreCase(
                                        product.getName());

                if (exists) {

                        throw new RuntimeException(
                                "Product already exists");
                }

                Product savedProduct = productRepository.save(product);

                String username = SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getName();

                inventoryTransactionService.createTransaction(
                                savedProduct,
                                "IN",
                                savedProduct.getQuantity(),
                                username);

                return savedProduct;
        }

        // Delete product
        public void deleteProduct(Long id) {

                Product product = productRepository
                                .findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Product not found"));

                String username = SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getName();

                inventoryTransactionService.createTransaction(
                                null,
                                "DELETE",
                                product.getQuantity(),
                                username);

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

                Product savedProduct = productRepository.save(existingProduct);

                String username = SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getName();

                inventoryTransactionService.createTransaction(
                                savedProduct,
                                "UPDATE",
                                savedProduct.getQuantity(),
                                username);

                return savedProduct;
        }

        public Product adjustStock(
                        Long productId,
                        StockAdjustmentRequest request) {

                Product product = productRepository
                                .findById(productId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Product not found"));

                if (request.getType().equals("IN")) {

                        product.setQuantity(
                                        product.getQuantity()
                                                        + request.getQuantity());

                } else if (request.getType().equals("OUT")) {

                        if (product.getQuantity() < request.getQuantity()) {

                                throw new RuntimeException(
                                                "Not enough stock");
                        }

                        product.setQuantity(
                                        product.getQuantity()
                                                        - request.getQuantity());
                }

                Product updatedProduct = productRepository.save(product);

                String username = SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getName();

                inventoryTransactionService.createTransaction(
                                product,
                                request.getType(),
                                request.getQuantity(),
                                username);

                return updatedProduct;
        }

}