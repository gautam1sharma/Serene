package com.serene.dms.repository;

import com.serene.dms.entity.Inquiry;
import com.serene.dms.enums.InquiryStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InquiryRepository extends JpaRepository<Inquiry, Long> {
    Page<Inquiry> findByStatus(InquiryStatus status, Pageable pageable);
    List<Inquiry> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<Inquiry> findByAssignedDealerIdOrderByCreatedAtDesc(Long dealerId);
    List<Inquiry> findByStatusOrderByCreatedAtDesc(InquiryStatus status);
    long countByStatus(InquiryStatus status);
}
