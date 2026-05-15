package com.inventra.backend.service;

import com.inventra.backend
        .dto.AnalyticsResponse;

import com.inventra.backend
        .repository.ProductRepository;

import com.inventra.backend
        .repository.SaleRepository;

import org.springframework
        .stereotype.Service;

@Service
public class AnalyticsService {

    private final SaleRepository
            saleRepository;

    private final ProductRepository
            productRepository;

    public AnalyticsService(
            SaleRepository saleRepository,
            ProductRepository productRepository
    ) {

        this.saleRepository =
                saleRepository;

        this.productRepository =
                productRepository;
    }

    public AnalyticsResponse
    getAnalytics() {

        Long totalSales =
                saleRepository.count();

        Double totalRevenue =
                saleRepository
                        .getTotalRevenue();

        Long lowStockProducts =
                productRepository
                        .countByQuantityLessThanEqual(
                                5
                        );

        Long totalProducts =
                productRepository.count();

        return new AnalyticsResponse(
                totalSales,
                totalRevenue,
                lowStockProducts,
                totalProducts
        );
    }
}