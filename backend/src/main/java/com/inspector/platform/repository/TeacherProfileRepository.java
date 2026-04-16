package com.inspector.platform.repository;

import com.inspector.platform.entity.Subject;
import com.inspector.platform.entity.TeacherProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherProfileRepository extends JpaRepository<TeacherProfile, Long> {
    Optional<TeacherProfile> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
    Optional<TeacherProfile> findByUserSerialCode(String serialCode);
    List<TeacherProfile> findByDelegationIdAndDependencyIdAndSubject(Long delegationId, Long dependencyId, Subject subject);
}
