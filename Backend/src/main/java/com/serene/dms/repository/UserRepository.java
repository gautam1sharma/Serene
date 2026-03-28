package com.serene.dms.repository;

import com.serene.dms.entity.User;
import com.serene.dms.enums.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Page<User> findByRole(UserRole role, Pageable pageable);
    long countByRole(UserRole role);

    @Query("SELECT u FROM User u WHERE u.dealership.id = :dealershipId")
    List<User> findByDealershipId(Long dealershipId);

    @Query("SELECT u FROM User u WHERE u.dealership.id = :dealershipId AND u.role = :role")
    Page<User> findByDealershipIdAndRole(Long dealershipId, UserRole role, Pageable pageable);

    @Query("SELECT u FROM User u WHERE (:role IS NULL OR u.role = :role)")
    Page<User> findByOptionalRole(UserRole role, Pageable pageable);
}
