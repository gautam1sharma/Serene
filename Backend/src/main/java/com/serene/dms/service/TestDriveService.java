package com.serene.dms.service;

import com.serene.dms.entity.TestDrive;
import com.serene.dms.entity.User;
import com.serene.dms.enums.TestDriveStatus;
import com.serene.dms.exception.ResourceNotFoundException;
import com.serene.dms.repository.TestDriveRepository;
import com.serene.dms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TestDriveService {

    private final TestDriveRepository testDriveRepository;
    private final UserRepository userRepository;

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
    public TestDrive schedule(TestDrive td) {
        td.setStatus(TestDriveStatus.PENDING);
        return testDriveRepository.save(td);
    }

    @Transactional
    public TestDrive updateStatus(Long id, TestDriveStatus status) {
        TestDrive td = getById(id);
        td.setStatus(status);
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
