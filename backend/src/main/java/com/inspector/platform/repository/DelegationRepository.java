package com.inspector.platform.repository;

import com.inspector.platform.entity.Delegation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DelegationRepository extends JpaRepository<Delegation, Long> {
    boolean existsByName(String name);
    
    @org.springframework.data.jpa.repository.Query("SELECT d FROM Delegation d WHERE d.region.id = :regionId")
    java.util.List<Delegation> findByRegion_Id(@org.springframework.data.repository.query.Param("regionId") Long regionId);
}
