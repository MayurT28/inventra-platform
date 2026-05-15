package com.inventra.backend.dto;

import java.time.LocalDateTime;

public class SaleResponse {

    private Long id;

    private Double totalAmount;

    private String soldBy;

    private LocalDateTime createdAt;

    public SaleResponse() {
    }

    public SaleResponse(
            Long id,
            Double totalAmount,
            String soldBy,
            LocalDateTime createdAt
    ) {

        this.id = id;
        this.totalAmount = totalAmount;
        this.soldBy = soldBy;
        this.createdAt = createdAt;
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

    public void setId(Long id) {
        this.id = id;
    }

    public void setTotalAmount(
            Double totalAmount
    ) {

        this.totalAmount =
                totalAmount;
    }

    public void setSoldBy(
            String soldBy
    ) {

        this.soldBy = soldBy;
    }

    public void setCreatedAt(
            LocalDateTime createdAt
    ) {

        this.createdAt = createdAt;
    }
}