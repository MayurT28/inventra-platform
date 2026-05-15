package com.inventra.backend.dto;

import java.util.List;

public class SaleRequest {

    private List<SaleItemRequest> items;

    public SaleRequest() {
    }

    public List<SaleItemRequest> getItems() {
        return items;
    }

    public void setItems(
            List<SaleItemRequest> items) {
        this.items = items;
    }
}