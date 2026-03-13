package com.inspector.platform.repository;

import com.inspector.platform.entity.Etablissement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EtablissementRepository extends JpaRepository<Etablissement, Long> {
    List<Etablissement> findByDependencyId(Long dependencyId);
    boolean existsByNameAndDependencyId(String name, Long dependencyId);
}
