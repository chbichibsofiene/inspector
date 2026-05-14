package com.inspector.platform.repository;

import com.inspector.platform.entity.Etablissement;
import com.inspector.platform.entity.SchoolLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EtablissementRepository extends JpaRepository<Etablissement, Long> {
    List<Etablissement> findByDependencyId(Long dependencyId);
    List<Etablissement> findByDependencyIdAndSchoolLevel(Long dependencyId, SchoolLevel schoolLevel);
    boolean existsByNameAndDependencyId(String name, Long dependencyId);
}
