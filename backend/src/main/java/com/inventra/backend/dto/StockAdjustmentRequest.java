package com.inventra.backend.dto;

public class StockAdjustmentRequest {

    private Integer quantity;

    private String type;

    public StockAdjustmentRequest() {
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}