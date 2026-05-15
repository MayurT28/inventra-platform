package com.inventra.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "sales")
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double totalAmount;

    private String soldBy;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<SaleItem> items;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Sale() {
    }

    public Long getId() {
        return id;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public String getSoldBy() {
        return soldBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public List<SaleItem> getItems() {
        return items;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTotalAmount(
            Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public void setSoldBy(String soldBy) {
        this.soldBy = soldBy;
    }

    public void setCreatedAt(
            LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setItems(
            List<SaleItem> items) {
        this.items = items;
    }
}