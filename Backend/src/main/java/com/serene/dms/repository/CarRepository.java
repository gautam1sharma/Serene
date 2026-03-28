package com.serene.dms.repository;

import com.serene.dms.entity.Car;
import com.serene.dms.enums.CarCategory;
import com.serene.dms.enums.CarStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long>, JpaSpecificationExecutor<Car> {
    List<Car> findByDealershipId(Long dealershipId);
    Page<Car> findByStatus(CarStatus status, Pageable pageable);
    List<Car> findByStatusOrderByCreatedAtDesc(CarStatus status);
    long countByStatus(CarStatus status);
    long countByDealershipId(Long dealershipId);

    @Query("SELECT c FROM Car c WHERE LOWER(c.model) LIKE LOWER(CONCAT('%',:query,'%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%',:query,'%'))")
    List<Car> searchCars(String query);

    @Query("SELECT COUNT(c) FROM Car c WHERE c.createdAt <= :cutoff AND c.status <> :excludedStatus")
    long countByCreatedAtBefore(java.time.LocalDateTime cutoff, @org.springframework.data.repository.query.Param("excludedStatus") com.serene.dms.enums.CarStatus excludedStatus);
}
