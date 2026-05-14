package com.inspector.platform.repository;

import com.inspector.platform.entity.Personnel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PersonnelRepository extends JpaRepository<Personnel, Long> {
    Optional<Personnel> findByCin(String cin);
    Optional<Personnel> findBySerialCode(String serialCode);
    boolean existsBySerialCode(String serialCode);
}
