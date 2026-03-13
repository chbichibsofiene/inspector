package com.inspector.platform.repository;

import com.inspector.platform.entity.Delegation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DelegationRepository extends JpaRepository<Delegation, Long> {
    boolean existsByName(String name);
}
