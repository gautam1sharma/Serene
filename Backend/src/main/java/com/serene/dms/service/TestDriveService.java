package com.serene.dms.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.serene.dms.dto.request.CreateTestDriveRequest;
import com.serene.dms.entity.Car;
import com.serene.dms.entity.Dealership;
import com.serene.dms.entity.TestDrive;
import com.serene.dms.entity.User;
import com.serene.dms.enums.TestDriveStatus;
import com.serene.dms.exception.ResourceNotFoundException;
import com.serene.dms.repository.CarRepository;
import com.serene.dms.repository.DealershipRepository;
import com.serene.dms.repository.TestDriveRepository;
import com.serene.dms.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class TestDriveService {

    private final TestDriveRepository testDriveRepository;
    private final UserRepository userRepository;
    private final CarRepository carRepository;
    private final DealershipRepository dealershipRepository;

    public Page<TestDrive> getAll(int page, int limit, TestDriveStatus status) {
        PageRequest pageReq = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.ASC, "preferredDate"));
        if (status != null) return testDriveRepository.findByStatus(status, pageReq);
        return testDriveRepository.findAll(pageReq);
    }

    public TestDrive getById(Long id) {
        return testDriveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test drive not found"));
    }

    @Transactional
    public TestDrive schedule(CreateTestDriveRequest request) {
        User customer;
        if (request.getCustomerId() != null) {
            customer = userRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        } else {
            customer = userRepository.findByEmail(request.getCustomerEmail())
                    .orElseGet(() -> {
                        String name = request.getCustomerName() != null ? request.getCustomerName() : "Guest";
                        int spaceIdx = name.indexOf(" ");
                        String fn = spaceIdx > 0 ? name.substring(0, spaceIdx) : name;
                        String ln = spaceIdx > 0 ? name.substring(spaceIdx + 1) : "";
                        User newUser = User.builder()
                                .email(request.getCustomerEmail())
                                .firstName(fn)
                                .lastName(ln)
                                .phone(request.getCustomerPhone())
                                .role(com.serene.dms.enums.UserRole.CUSTOMER)
                                .status(com.serene.dms.enums.UserStatus.ACTIVE)
                                .passwordHash("GUEST_" + java.util.UUID.randomUUID().toString())
                                .build();
                        return userRepository.save(newUser);
                    });
        }

        Car car = carRepository.findById(request.getCarId())
                .orElseThrow(() -> new ResourceNotFoundException("Car not found"));
        Dealership dealership = dealershipRepository.findById(request.getDealershipId())
                .orElseThrow(() -> new ResourceNotFoundException("Dealership not found"));

        TestDrive td = TestDrive.builder()
                .customer(customer)
                .customerName(request.getCustomerName())
                .customerEmail(request.getCustomerEmail())
                .customerPhone(request.getCustomerPhone())
                .car(car)
                .carModel(request.getCarModel())
                .dealership(dealership)
                .preferredDate(request.getPreferredDate())
                .preferredTime(request.getPreferredTime() != null ? request.getPreferredTime() : "")
                .notes(request.getNotes())
                .status(TestDriveStatus.PENDING)
                .build();
        TestDrive saved = testDriveRepository.save(td);
        log.info("Test drive scheduled: id={}, carId={}, date={}", saved.getId(), request.getCarId(), request.getPreferredDate());
        return saved;
    }

    @Transactional
    public TestDrive updateStatus(Long id, TestDriveStatus status) {
        TestDrive td = getById(id);
        td.setStatus(status);
        log.info("Test drive status updated: id={}, status={}", id, status);
        return testDriveRepository.save(td);
    }

    @Transactional
    public TestDrive assignDealer(Long id, Long dealerId) {
        TestDrive td = getById(id);
        User dealer = userRepository.findById(dealerId)
                .orElseThrow(() -> new ResourceNotFoundException("Dealer not found"));
        td.setAssignedDealer(dealer);
        return testDriveRepository.save(td);
    }

    @Transactional
    public TestDrive addFeedback(Long id, String feedback, Integer rating) {
        TestDrive td = getById(id);
        td.setFeedback(feedback);
        td.setRating(rating);
        return testDriveRepository.save(td);
    }

    @Transactional
    public TestDrive cancel(Long id, String reason) {
        TestDrive td = getById(id);
        td.setStatus(TestDriveStatus.CANCELLED);
        if (reason != null) td.setNotes(reason);
        return testDriveRepository.save(td);
    }

    public List<TestDrive> getByCustomer(Long customerId) {
        return testDriveRepository.findByCustomerIdOrderByPreferredDateDesc(customerId);
    }

    public List<TestDrive> getUpcoming(int limit) {
        List<TestDriveStatus> active = List.of(TestDriveStatus.PENDING, TestDriveStatus.CONFIRMED);
        return testDriveRepository.findByStatusInAndPreferredDateGreaterThanEqualOrderByPreferredDateAsc(
                active, LocalDate.now()).stream().limit(limit).toList();
    }
}
