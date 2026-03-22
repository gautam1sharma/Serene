package com.serene.dms.repository;

import com.serene.dms.entity.TestDrive;
import com.serene.dms.enums.TestDriveStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TestDriveRepository extends JpaRepository<TestDrive, Long> {
    List<TestDrive> findByCustomerIdOrderByPreferredDateDesc(Long customerId);
    List<TestDrive> findByDealershipIdOrderByPreferredDateAsc(Long dealershipId);
    List<TestDrive> findByStatusInAndPreferredDateGreaterThanEqualOrderByPreferredDateAsc(
            List<TestDriveStatus> statuses, LocalDate date);
    Page<TestDrive> findByStatus(TestDriveStatus status, Pageable pageable);
    long countByStatusIn(List<TestDriveStatus> statuses);
}
