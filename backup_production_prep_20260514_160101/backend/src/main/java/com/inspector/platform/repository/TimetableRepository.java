package com.inspector.platform.repository;

import com.inspector.platform.entity.TimetableSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimetableRepository extends JpaRepository<TimetableSlot, Long> {
    List<TimetableSlot> findByTeacherId(Long teacherId);
}
