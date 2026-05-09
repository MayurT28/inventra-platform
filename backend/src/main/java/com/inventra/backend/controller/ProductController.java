package com.inventra.backend.controller;

import com.inventra.backend.entity.Product;
import com.inventra.backend.service.ProductService;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import com.inventra.backend.dto.ProductRequest;
import com.inventra.backend.response.ApiResponse;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // GET all products
    @GetMapping
    public ApiResponse<List<Product>> getAllProducts() {

        List<Product> products = productService.getAllProducts();

        return new ApiResponse<>(
                true,
                "Products fetched successfully",
                products);
    }

    // POST new product
    @PostMapping
    public ApiResponse<Product> addProduct(
            @Valid @RequestBody ProductRequest request) {

        Product product = new Product();

        product.setName(request.getName());
        product.setCategory(request.getCategory());
        product.setQuantity(request.getQuantity());
        product.setPrice(request.getPrice());

        Product savedProduct = productService.addProduct(product);

        return new ApiResponse<>(
                true,
                "Product added successfully",
                savedProduct);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteProduct(@PathVariable Long id) {

        productService.deleteProduct(id);

        return new ApiResponse<>(
                true,
                "Product deleted successfully",
                null);
    }

    @PutMapping("/{id}")
    public ApiResponse<Product> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {

        Product product = new Product();

        product.setName(request.getName());
        product.setCategory(request.getCategory());
        product.setQuantity(request.getQuantity());
        product.setPrice(request.getPrice());

        Product updatedProduct = productService.updateProduct(id, product);

        return new ApiResponse<>(
                true,
                "Product updated successfully",
                updatedProduct);
    }
}