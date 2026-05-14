package com.inspector.platform.repository;

import com.inspector.platform.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    List<Department> findByDelegationId(Long delegationId);
    boolean existsByNameAndDelegationId(String name, Long delegationId);
}
