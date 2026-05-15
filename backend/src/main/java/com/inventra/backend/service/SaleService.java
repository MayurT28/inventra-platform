package com.inventra.backend.service;

import com.inventra.backend.dto.SaleItemRequest;
import com.inventra.backend.dto.SaleRequest;
import com.inventra.backend.entity.Product;
import com.inventra.backend.entity.Sale;
import com.inventra.backend.entity.SaleItem;
import com.inventra.backend.repository.ProductRepository;
import com.inventra.backend.repository.SaleRepository;
import org.springframework.security.core.context
        .SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import com.inventra.backend.dto.SaleResponse;

@Service
public class SaleService {

    private final SaleRepository saleRepository;

    private final ProductRepository
            productRepository;

    private final InventoryTransactionService
            inventoryTransactionService;

    public SaleService(
            SaleRepository saleRepository,
            ProductRepository productRepository,
            InventoryTransactionService
                    inventoryTransactionService
    ) {

        this.saleRepository =
                saleRepository;

        this.productRepository =
                productRepository;

        this.inventoryTransactionService =
                inventoryTransactionService;
    }

    public Sale createSale(
            SaleRequest request
    ) {

        Sale sale = new Sale();

        List<SaleItem> saleItems =
                new ArrayList<>();

        double totalAmount = 0;

        String username =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        for (
                SaleItemRequest itemRequest
                        : request.getItems()
        ) {

            Product product =
                    productRepository
                            .findById(
                                    itemRequest
                                            .getProductId()
                            )
                            .orElseThrow(
                                    () ->
                                            new RuntimeException(
                                                    "Product not found"
                                            )
                            );

            if (
                    product.getQuantity()
                            < itemRequest
                            .getQuantity()
            ) {

                throw new RuntimeException(
                        "Insufficient stock for "
                                + product.getName()
                );
            }

            product.setQuantity(
                    product.getQuantity()
                            - itemRequest
                            .getQuantity()
            );

            productRepository.save(product);

            SaleItem saleItem =
                    new SaleItem();

            saleItem.setSale(sale);

            saleItem.setProduct(product);

            saleItem.setProductName(
                    product.getName()
            );

            saleItem.setQuantity(
                    itemRequest.getQuantity()
            );

            saleItem.setUnitPrice(
                    product.getPrice()
            );

            double subtotal =
                    product.getPrice()
                            * itemRequest
                            .getQuantity();

            saleItem.setSubtotal(
                    subtotal
            );

            totalAmount += subtotal;

            saleItems.add(saleItem);

            inventoryTransactionService
                    .createTransaction(
                            product,
                            "SALE",
                            itemRequest
                                    .getQuantity(),
                            username
                    );
        }

        sale.setItems(saleItems);

        sale.setTotalAmount(totalAmount);

        sale.setSoldBy(username);

        return saleRepository.save(sale);
    }

    public List<SaleResponse>
        getAllSales() {

        return saleRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(sale ->
                        new SaleResponse(
                                sale.getId(),
                                sale.getTotalAmount(),
                                sale.getSoldBy(),
                                sale.getCreatedAt()
                        )
                )
                .toList();
        }
}