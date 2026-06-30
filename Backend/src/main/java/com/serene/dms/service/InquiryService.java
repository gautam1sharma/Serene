package com.serene.dms.service;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.serene.dms.dto.request.CreateInquiryRequest;
import com.serene.dms.dto.response.InquiryResponse;
import com.serene.dms.entity.Car;
import com.serene.dms.entity.Inquiry;
import com.serene.dms.entity.User;
import com.serene.dms.enums.InquiryStatus;
import com.serene.dms.exception.ResourceNotFoundException;
import com.serene.dms.repository.CarRepository;
import com.serene.dms.repository.InquiryRepository;
import com.serene.dms.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class InquiryService {

    private final InquiryRepository inquiryRepository;
    private final UserRepository userRepository;
    private final CarRepository carRepository;

    @Transactional(readOnly = true)
    public Page<InquiryResponse> getInquiries(int page, int limit, InquiryStatus status) {
        PageRequest pageReq = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Inquiry> result = status != null
                ? inquiryRepository.findByStatus(status, pageReq)
                : inquiryRepository.findAll(pageReq);
        return result.map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public InquiryResponse getById(Long id) {
        Inquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry not found"));
        return toResponse(inquiry);
    }

    @Transactional
    public InquiryResponse create(CreateInquiryRequest request) {
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

        Inquiry inquiry = Inquiry.builder()
                .customer(customer)
                .customerName(request.getCustomerName())
                .customerEmail(request.getCustomerEmail())
                .customerPhone(request.getCustomerPhone())
                .car(car)
                .carModel(car.getModel())
                .message(request.getMessage())
                .status(InquiryStatus.PENDING)
                .build();

        InquiryResponse response = toResponse(inquiryRepository.save(inquiry));
        log.info("Inquiry created: id={}, carId={}, customerEmail={}", response.getId(), request.getCarId(), request.getCustomerEmail());
        return response;
    }

    @Transactional
    public InquiryResponse respond(Long id, Long dealerId) {
        Inquiry inq = inquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry not found"));
        User dealer = userRepository.findById(dealerId)
                .orElseThrow(() -> new ResourceNotFoundException("Dealer not found"));
        inq.setStatus(InquiryStatus.RESPONDED);
        inq.setAssignedDealer(dealer);
        log.info("Inquiry responded: id={}, dealerId={}", id, dealerId);
        return toResponse(inquiryRepository.save(inq));
    }

    @Transactional
    public InquiryResponse close(Long id) {
        Inquiry inq = inquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry not found"));
        inq.setStatus(InquiryStatus.CLOSED);
        log.info("Inquiry closed: id={}", id);
        return toResponse(inquiryRepository.save(inq));
    }

    @Transactional
    public InquiryResponse assign(Long id, Long dealerId) {
        Inquiry inq = inquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry not found"));
        User dealer = userRepository.findById(dealerId)
                .orElseThrow(() -> new ResourceNotFoundException("Dealer not found"));
        inq.setAssignedDealer(dealer);
        return toResponse(inquiryRepository.save(inq));
    }

    @Transactional(readOnly = true)
    public List<InquiryResponse> getByCustomer(Long customerId) {
        return inquiryRepository.findByCustomerIdOrderByCreatedAtDesc(customerId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<InquiryResponse> getPending(int limit) {
        return inquiryRepository.findByStatusOrderByCreatedAtDesc(InquiryStatus.PENDING)
                .stream()
                .limit(limit)
                .map(this::toResponse)
                .toList();
    }

    public Map<String, Long> getStatistics() {
        return Map.of(
                "totalInquiries", inquiryRepository.count(),
                "pendingInquiries", inquiryRepository.countByStatus(InquiryStatus.PENDING),
                "respondedInquiries", inquiryRepository.countByStatus(InquiryStatus.RESPONDED),
                "closedInquiries", inquiryRepository.countByStatus(InquiryStatus.CLOSED)
        );
    }

    private InquiryResponse toResponse(Inquiry i) {
        return InquiryResponse.builder()
                .id(String.valueOf(i.getId()))
                .customerId(String.valueOf(i.getCustomer().getId()))
                .customerName(i.getCustomerName())
                .customerEmail(i.getCustomerEmail())
                .customerPhone(i.getCustomerPhone())
                .carId(String.valueOf(i.getCar().getId()))
                .carModel(i.getCarModel())
                .message(i.getMessage())
                .status(i.getStatus())
                .assignedDealerId(i.getAssignedDealer() != null
                        ? String.valueOf(i.getAssignedDealer().getId()) : null)
                .createdAt(i.getCreatedAt())
                .updatedAt(i.getUpdatedAt())
                .build();
    }
}
