package com.inventra.backend.controller;

import com.inventra.backend.entity.Product;
import com.inventra.backend.service.ProductService;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import com.inventra.backend.dto.ProductRequest;

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
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // POST new product
    @PostMapping
    public Product addProduct(@Valid @RequestBody ProductRequest request) {

        Product product = new Product();

        product.setName(request.getName());
        product.setCategory(request.getCategory());
        product.setQuantity(request.getQuantity());
        product.setPrice(request.getPrice());

        return productService.addProduct(product);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }

    @PutMapping("/{id}")
    public Product updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {

        Product product = new Product();

        product.setName(request.getName());
        product.setCategory(request.getCategory());
        product.setQuantity(request.getQuantity());
        product.setPrice(request.getPrice());

        return productService.updateProduct(id, product);
    }
}