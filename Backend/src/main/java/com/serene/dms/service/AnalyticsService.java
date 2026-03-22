package com.serene.dms.service;

import com.serene.dms.enums.*;
import com.serene.dms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

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
        long totalCars = carRepository.count();
        long totalSales = orderRepository.countByStatus(OrderStatus.DELIVERED);
        BigDecimal totalRevenue = dealershipId != null
                ? orderRepository.sumRevenueByDealershipId(dealershipId)
                : orderRepository.sumTotalRevenue();
        long pendingInquiries = inquiryRepository.countByStatus(InquiryStatus.PENDING);
        long upcomingTestDrives = testDriveRepository.countByStatusIn(
                List.of(TestDriveStatus.PENDING, TestDriveStatus.CONFIRMED));

        return Map.of(
                "totalUsers", totalUsers,
                "totalCars", totalCars,
                "totalSales", totalSales,
                "totalRevenue", totalRevenue,
                "pendingInquiries", pendingInquiries,
                "upcomingTestDrives", upcomingTestDrives,
                "monthlyGrowth", 12.5
        );
    }

    public Map<String, Object> getInventoryStatus(Long dealershipId) {
        long available = carRepository.countByStatus(CarStatus.AVAILABLE);
        long reserved = carRepository.countByStatus(CarStatus.RESERVED);
        long sold = carRepository.countByStatus(CarStatus.SOLD);
        long inTransit = carRepository.countByStatus(CarStatus.IN_TRANSIT);
        long maintenance = carRepository.countByStatus(CarStatus.MAINTENANCE);

        return Map.of("available", available, "reserved", reserved, "sold", sold,
                "inTransit", inTransit, "maintenance", maintenance);
    }

    public Map<String, Object> getSalesReport(String period, Long dealershipId) {
        long totalSales = orderRepository.countByStatus(OrderStatus.DELIVERED);
        BigDecimal totalRevenue = dealershipId != null
                ? orderRepository.sumRevenueByDealershipId(dealershipId)
                : orderRepository.sumTotalRevenue();

        return Map.of("period", period != null ? period : "current",
                "totalSales", totalSales, "totalRevenue", totalRevenue);
    }
}
