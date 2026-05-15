package com.inventra.backend.repository;

import com.inventra.backend.entity.SaleItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleItemRepository
        extends JpaRepository<SaleItem, Long> {
}