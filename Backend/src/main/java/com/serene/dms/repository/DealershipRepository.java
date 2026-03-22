package com.serene.dms.repository;

import com.serene.dms.entity.Dealership;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DealershipRepository extends JpaRepository<Dealership, Long> {
    Optional<Dealership> findByCode(String code);
    boolean existsByCode(String code);
}
