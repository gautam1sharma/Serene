package com.serene.dms.service;

import com.serene.dms.enums.*;
import com.serene.dms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
    import java.util.stream.Collectors;

    // Trigger devtools hot reload

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final UserRepository userRepository;
    private final CarRepository carRepository;
    private final OrderRepository orderRepository;
    private final InquiryRepository inquiryRepository;
    private final TestDriveRepository testDriveRepository;

    public Map<String, Object> getDashboardMetrics(Long dealershipId) {
        long totalUsers = userRepository.countByRole(UserRole.CUSTOMER);
        long totalCars = dealershipId != null
                ? carRepository.countByDealershipId(dealershipId)
                : carRepository.count();
        long totalSales = orderRepository.countByStatus(OrderStatus.DELIVERED);
        BigDecimal rawRevenue = dealershipId != null
                ? orderRepository.sumRevenueByDealershipId(dealershipId)
                : orderRepository.sumTotalRevenue();
        BigDecimal totalRevenue = rawRevenue != null ? rawRevenue : BigDecimal.ZERO;
        long pendingInquiries = inquiryRepository.countByStatus(InquiryStatus.PENDING);
        long upcomingTestDrives = testDriveRepository.countByStatusIn(
                List.of(TestDriveStatus.PENDING, TestDriveStatus.CONFIRMED));

        // Use LinkedHashMap to safely hold all values (Map.of throws NPE on null values)
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalUsers", totalUsers);
        result.put("totalCars", totalCars);
        result.put("totalSales", totalSales);
        result.put("totalRevenue", totalRevenue);
        result.put("pendingInquiries", pendingInquiries);
        result.put("upcomingTestDrives", upcomingTestDrives);
        result.put("monthlyGrowth", 12.5);
        return result;
    }

    public Map<String, Object> getInventoryStatus(Long dealershipId) {
        long available = carRepository.countByStatus(CarStatus.AVAILABLE);
        long reserved = carRepository.countByStatus(CarStatus.RESERVED);
        long sold = carRepository.countByStatus(CarStatus.SOLD);
        long inTransit = carRepository.countByStatus(CarStatus.IN_TRANSIT);
        long maintenance = carRepository.countByStatus(CarStatus.MAINTENANCE);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("available", available);
        result.put("reserved", reserved);
        result.put("sold", sold);
        result.put("inTransit", inTransit);
        result.put("maintenance", maintenance);
        return result;
    }

    public Map<String, Object> getSalesReport(String period, Long dealershipId) {
        long totalSales = orderRepository.countByStatus(OrderStatus.DELIVERED);
        BigDecimal rawRevenue = dealershipId != null
                ? orderRepository.sumRevenueByDealershipId(dealershipId)
                : orderRepository.sumTotalRevenue();
        BigDecimal totalRevenue = rawRevenue != null ? rawRevenue : BigDecimal.ZERO;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("period", period != null ? period : "current");
        result.put("totalSales", totalSales);
        result.put("totalRevenue", totalRevenue);
        return result;
    }

    public List<Map<String, Object>> getRevenueTrends(int days) {
        LocalDateTime since = LocalDate.now().minusDays(days - 1).atStartOfDay();
        List<com.serene.dms.entity.Order> orders = orderRepository.findByCreatedAtGreaterThanEqual(since);

        Map<LocalDate, BigDecimal> byDate = orders.stream()
                .collect(Collectors.groupingBy(
                        o -> o.getCreatedAt().toLocalDate(),
                        Collectors.mapping(com.serene.dms.entity.Order::getFinalAmount, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
                ));

        List<Map<String, Object>> result = new ArrayList<>();
        for (int i = 0; i < days; i++) {
            LocalDate day = since.toLocalDate().plusDays(i);
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("date", day.toString());
            entry.put("revenue", byDate.getOrDefault(day, BigDecimal.ZERO));
            result.add(entry);
        }
        return result;
    }

    public Map<String, Object> getInventoryAging() {
        LocalDateTime now = LocalDateTime.now();
        long over30 = carRepository.countByCreatedAtBefore(now.minusDays(30), com.serene.dms.enums.CarStatus.SOLD);
        long over60 = carRepository.countByCreatedAtBefore(now.minusDays(60), com.serene.dms.enums.CarStatus.SOLD);
        long over90 = carRepository.countByCreatedAtBefore(now.minusDays(90), com.serene.dms.enums.CarStatus.SOLD);
        long total = carRepository.count();
        long fresh = total - over30;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("total", total);
        result.put("fresh", fresh);
        result.put("over30", over30);
        result.put("over60", over60);
        result.put("over90", over90);
        return result;
    }

    public List<Map<String, Object>> getRecentOrders(int limit) {
        return orderRepository.findByOrderByCreatedAtDesc(PageRequest.of(0, limit))
                .stream()
                .map(o -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", o.getId());
                    m.put("orderNumber", o.getOrderNumber());
                    m.put("status", o.getStatus());
                    m.put("finalAmount", o.getFinalAmount());
                    m.put("createdAt", o.getCreatedAt());
                    m.put("customerName", o.getCustomerName());
                    m.put("carModel", o.getCarModel());
                    return m;
                })
                .collect(Collectors.toList());
    }

    public Map<String, Long> getMarketingROI() {
        List<com.serene.dms.entity.Inquiry> inquiries = inquiryRepository.findAll();
        return inquiries.stream()
            .collect(Collectors.groupingBy(
                i -> i.getChannel() != null ? i.getChannel().name() : "OTHER",
                Collectors.counting()
            ));
    }
}
