package com.inventra.backend.service;

import com.inventra.backend.entity.InventoryTransaction;
import com.inventra.backend.repository.InventoryTransactionRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import com.inventra.backend.entity.Product;

@Service
public class InventoryTransactionService {

    private final InventoryTransactionRepository transactionRepository;

    public InventoryTransactionService(
            InventoryTransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public void createTransaction(
            Product product,
            String type,
            Integer quantity,
            String performedBy) {

        InventoryTransaction transaction = new InventoryTransaction();

        if (product != null) {

            transaction.setProduct(product);

            transaction.setProductNameSnapshot(
                    product.getName());
        } else {

            transaction.setProductNameSnapshot(
                    "Deleted Product");
        }

        transaction.setType(type);

        transaction.setQuantity(quantity);

        transaction.setPerformedBy(performedBy);

        transaction.setTimestamp(LocalDateTime.now());

        transactionRepository.save(transaction);
    }
}