package com.inventra.backend.controller;

import com.inventra.backend.dto.SaleRequest;
import com.inventra.backend.entity.Sale;
import com.inventra.backend.response.ApiResponse;
import com.inventra.backend.service.SaleService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.inventra.backend
        .dto.SaleResponse;

@RestController
@RequestMapping("/api/sales")

@CrossOrigin(origins = "http://localhost:5173")
public class SaleController {

    private final SaleService saleService;

    public SaleController(
            SaleService saleService) {

        this.saleService = saleService;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    @PostMapping
    public ApiResponse<Sale> createSale(
            @RequestBody SaleRequest request) {

        Sale sale = saleService
                .createSale(request);

        return new ApiResponse<>(
                true,
                "Sale completed successfully",
                sale);
    }

    @GetMapping
    public ApiResponse<
            List<SaleResponse>
            > getSales() {

        return new ApiResponse<>(
                true,
                "Sales fetched successfully",
                saleService.getAllSales()
        );
    }
}