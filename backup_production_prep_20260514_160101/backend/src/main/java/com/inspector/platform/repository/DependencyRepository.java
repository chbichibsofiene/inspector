package com.inspector.platform.repository;

import com.inspector.platform.entity.Dependency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DependencyRepository extends JpaRepository<Dependency, Long> {
    List<Dependency> findByDelegationId(Long delegationId);
    boolean existsByNameAndDelegationId(String name, Long delegationId);
}
