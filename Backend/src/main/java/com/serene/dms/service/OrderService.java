package com.serene.dms.service;

import com.serene.dms.entity.Order;
import com.serene.dms.enums.OrderStatus;
import com.serene.dms.enums.PaymentStatus;
import com.serene.dms.exception.ResourceNotFoundException;
import com.serene.dms.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    public Page<Order> getOrders(int page, int limit, OrderStatus status) {
        PageRequest pageReq = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        if (status != null) return orderRepository.findByStatus(status, pageReq);
        return orderRepository.findAll(pageReq);
    }

    public Order getById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

    @Transactional
    public Order create(Order order) {
        String orderNumber = "SRN-" + java.time.Year.now().getValue() + "-" +
                String.format("%03d", orderRepository.count() + 1);
        order.setOrderNumber(orderNumber);
        order.setStatus(OrderStatus.PENDING);
        order.setPaymentStatus(PaymentStatus.PENDING);
        Order saved = orderRepository.save(order);
        log.info("Order created: orderNumber={}", saved.getOrderNumber());
        return saved;
    }

    @Transactional
    public Order updateStatus(Long id, OrderStatus status) {
        Order order = getById(id);
        order.setStatus(status);
        Order saved = orderRepository.save(order);
        log.info("Order status updated: id={}, status={}", id, status);
        return saved;
    }

    @Transactional
    public Order updatePaymentStatus(Long id, PaymentStatus paymentStatus) {
        Order order = getById(id);
        order.setPaymentStatus(paymentStatus);
        Order saved = orderRepository.save(order);
        log.info("Order payment status updated: id={}, paymentStatus={}", id, paymentStatus);
        return saved;
    }

    public List<Order> getByCustomer(Long customerId) {
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    public List<Order> getRecent(int limit) {
        return orderRepository.findAll(PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"))).getContent();
    }

    public Map<String, Object> getStatistics(Long dealershipId) {
        long total = orderRepository.count();
        long pending = orderRepository.countByStatusIn(List.of(OrderStatus.PENDING, OrderStatus.PROCESSING));
        long completed = orderRepository.countByStatus(OrderStatus.DELIVERED);
        BigDecimal revenue = dealershipId != null
                ? orderRepository.sumRevenueByDealershipId(dealershipId)
                : orderRepository.sumTotalRevenue();
        return Map.of("totalOrders", total, "pendingOrders", pending,
                "completedOrders", completed, "totalRevenue", revenue);
    }
}

