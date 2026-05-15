package com.inventra.backend.controller;

import com.inventra.backend.entity.InventoryTransaction;
import com.inventra.backend.repository.InventoryTransactionRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class InventoryTransactionController {

    private final InventoryTransactionRepository transactionRepository;

    public InventoryTransactionController(
            InventoryTransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @GetMapping
    public List<InventoryTransaction> getAllTransactions() {
        return transactionRepository
                .findAllByOrderByTimestampDesc();
    }
}