package com.serene.dms.repository;

import com.serene.dms.entity.Order;
import com.serene.dms.enums.OrderStatus;
import com.serene.dms.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);
    List<Order> findByDealershipIdOrderByCreatedAtDesc(Long dealershipId);
    long countByStatus(OrderStatus status);
    long countByStatusIn(List<OrderStatus> statuses);

    @Query("SELECT COALESCE(SUM(o.finalAmount), 0) FROM Order o WHERE o.dealership.id = :dealershipId")
    BigDecimal sumRevenueByDealershipId(Long dealershipId);

    @Query("SELECT COALESCE(SUM(o.finalAmount), 0) FROM Order o")
    BigDecimal sumTotalRevenue();

    List<Order> findByCreatedAtGreaterThanEqual(java.time.LocalDateTime since);

    List<Order> findByOrderByCreatedAtDesc(org.springframework.data.domain.Pageable pageable);
}
