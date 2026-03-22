package com.serene.dms.service;

import com.serene.dms.entity.Inquiry;
import com.serene.dms.entity.User;
import com.serene.dms.enums.InquiryStatus;
import com.serene.dms.exception.ResourceNotFoundException;
import com.serene.dms.repository.InquiryRepository;
import com.serene.dms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InquiryService {

    private final InquiryRepository inquiryRepository;
    private final UserRepository userRepository;

    public Page<Inquiry> getInquiries(int page, int limit, InquiryStatus status) {
        PageRequest pageReq = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        if (status != null) return inquiryRepository.findByStatus(status, pageReq);
        return inquiryRepository.findAll(pageReq);
    }

    public Inquiry getById(Long id) {
        return inquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry not found"));
    }

    @Transactional
    public Inquiry create(Inquiry inquiry) {
        inquiry.setStatus(InquiryStatus.PENDING);
        return inquiryRepository.save(inquiry);
    }

    @Transactional
    public Inquiry respond(Long id, Long dealerId) {
        Inquiry inq = getById(id);
        User dealer = userRepository.findById(dealerId)
                .orElseThrow(() -> new ResourceNotFoundException("Dealer not found"));
        inq.setStatus(InquiryStatus.RESPONDED);
        inq.setAssignedDealer(dealer);
        return inquiryRepository.save(inq);
    }

    @Transactional
    public Inquiry close(Long id) {
        Inquiry inq = getById(id);
        inq.setStatus(InquiryStatus.CLOSED);
        return inquiryRepository.save(inq);
    }

    @Transactional
    public Inquiry assign(Long id, Long dealerId) {
        Inquiry inq = getById(id);
        User dealer = userRepository.findById(dealerId)
                .orElseThrow(() -> new ResourceNotFoundException("Dealer not found"));
        inq.setAssignedDealer(dealer);
        return inquiryRepository.save(inq);
    }

    public List<Inquiry> getByCustomer(Long customerId) {
        return inquiryRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    public List<Inquiry> getPending(int limit) {
        return inquiryRepository.findByStatusOrderByCreatedAtDesc(InquiryStatus.PENDING)
                .stream().limit(limit).toList();
    }

    public Map<String, Long> getStatistics() {
        return Map.of(
                "totalInquiries", inquiryRepository.count(),
                "pendingInquiries", inquiryRepository.countByStatus(InquiryStatus.PENDING),
                "respondedInquiries", inquiryRepository.countByStatus(InquiryStatus.RESPONDED),
                "closedInquiries", inquiryRepository.countByStatus(InquiryStatus.CLOSED)
        );
    }
}
