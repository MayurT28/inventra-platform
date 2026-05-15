package com.inventra.backend.repository;

import com.inventra.backend.entity.Sale;

import org.springframework.data.jpa
        .repository.JpaRepository;
        import org.springframework.data.jpa.repository.Query;

import java.util.List;
import org.springframework
        .data.jpa.repository.Query;

public interface SaleRepository
        extends JpaRepository<Sale, Long> {

    List<Sale>
    findAllByOrderByCreatedAtDesc();
    Long countBy();

    @Query("""
    SELECT COALESCE(
        SUM(s.totalAmount),
        0
    )
    FROM Sale s
    """)
    Double getTotalRevenue();
}