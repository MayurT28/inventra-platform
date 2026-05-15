package com.inventra.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "sale_items")
public class SaleItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sale_id")
    @JsonBackReference
    private Sale sale;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private String productName;

    private Integer quantity;

    private Double unitPrice;

    private Double subtotal;

    public SaleItem() {
    }

    public Long getId() {
        return id;
    }

    public Sale getSale() {
        return sale;
    }

    public Product getProduct() {
        return product;
    }

    public String getProductName() {
        return productName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public Double getUnitPrice() {
        return unitPrice;
    }

    public Double getSubtotal() {
        return subtotal;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setSale(Sale sale) {
        this.sale = sale;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public void setProductName(
            String productName) {
        this.productName = productName;
    }

    public void setQuantity(
            Integer quantity) {
        this.quantity = quantity;
    }

    public void setUnitPrice(
            Double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public void setSubtotal(
            Double subtotal) {
        this.subtotal = subtotal;
    }
}