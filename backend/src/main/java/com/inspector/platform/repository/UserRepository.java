package com.inspector.platform.repository;

import com.inspector.platform.entity.Role;
import com.inspector.platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findBySerialCode(String serialCode);

    boolean existsByEmail(String email);

    boolean existsBySerialCode(String serialCode);

    
    List<User> findByEnabledFalse();

    
    List<User> findByEnabledTrue();

    
    List<User> findByRole(Role role);

    long countByRole(Role role);
}

