package com.inventra.backend.dto;

public class AnalyticsResponse {

    private Long totalSales;

    private Double totalRevenue;

    private Long lowStockProducts;

    private Long totalProducts;

    public AnalyticsResponse() {
    }

    public AnalyticsResponse(
            Long totalSales,
            Double totalRevenue,
            Long lowStockProducts,
            Long totalProducts
    ) {

        this.totalSales =
                totalSales;

        this.totalRevenue =
                totalRevenue;

        this.lowStockProducts =
                lowStockProducts;

        this.totalProducts =
                totalProducts;
    }

    public Long getTotalSales() {
        return totalSales;
    }

    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public Long getLowStockProducts() {
        return lowStockProducts;
    }

    public Long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalSales(
            Long totalSales
    ) {

        this.totalSales =
                totalSales;
    }

    public void setTotalRevenue(
            Double totalRevenue
    ) {

        this.totalRevenue =
                totalRevenue;
    }

    public void setLowStockProducts(
            Long lowStockProducts
    ) {

        this.lowStockProducts =
                lowStockProducts;
    }

    public void setTotalProducts(
            Long totalProducts
    ) {

        this.totalProducts =
                totalProducts;
    }
}