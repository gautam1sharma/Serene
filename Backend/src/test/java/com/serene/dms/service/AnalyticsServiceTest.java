package com.serene.dms.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.anyLong;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.serene.dms.entity.Inquiry;
import com.serene.dms.enums.InquiryChannel;
import com.serene.dms.enums.InquiryStatus;
import com.serene.dms.enums.OrderStatus;
import com.serene.dms.enums.TestDriveStatus;
import com.serene.dms.enums.UserRole;
import com.serene.dms.repository.CarRepository;
import com.serene.dms.repository.InquiryRepository;
import com.serene.dms.repository.OrderRepository;
import com.serene.dms.repository.TestDriveRepository;
import com.serene.dms.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CarRepository carRepository;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private InquiryRepository inquiryRepository;

    @Mock
    private TestDriveRepository testDriveRepository;

    @InjectMocks
    private AnalyticsService analyticsService;

    @Test
    void getDashboardMetrics_whenRevenueIsNullFallsBackToZero() {
        when(userRepository.countByRole(UserRole.CUSTOMER)).thenReturn(12L);
        when(carRepository.count()).thenReturn(8L);
        when(orderRepository.countByStatus(OrderStatus.DELIVERED)).thenReturn(5L);
        when(orderRepository.sumTotalRevenue()).thenReturn(null);
        when(inquiryRepository.countByStatus(InquiryStatus.PENDING)).thenReturn(3L);
        when(testDriveRepository.countByStatusIn(List.of(TestDriveStatus.PENDING, TestDriveStatus.CONFIRMED)))
                .thenReturn(4L);

        Map<String, Object> metrics = analyticsService.getDashboardMetrics(null);

        assertEquals(12L, metrics.get("totalUsers"));
        assertEquals(8L, metrics.get("totalCars"));
        assertEquals(BigDecimal.ZERO, metrics.get("totalRevenue"));
        assertEquals(12.5, metrics.get("monthlyGrowth"));
        verify(orderRepository).sumTotalRevenue();
        verify(orderRepository, never()).sumRevenueByDealershipId(anyLong());
    }

    @Test
    void getMarketingRoi_groupsNullChannelsAsOther() {
        Inquiry website = Inquiry.builder().channel(InquiryChannel.WEBSITE).build();
        Inquiry walkIn = Inquiry.builder().channel(InquiryChannel.WALK_IN).build();
        Inquiry unknownA = Inquiry.builder().channel(null).build();
        Inquiry unknownB = Inquiry.builder().channel(null).build();

        when(inquiryRepository.findAll()).thenReturn(List.of(website, walkIn, unknownA, unknownB));

        Map<String, Long> roi = analyticsService.getMarketingROI();

        assertEquals(1L, roi.get("WEBSITE"));
        assertEquals(1L, roi.get("WALK_IN"));
        assertEquals(2L, roi.get("OTHER"));
    }
}