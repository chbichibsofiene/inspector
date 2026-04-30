package com.inspector.platform.repository;

import com.inspector.platform.entity.CourseAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseAssignmentRepository extends JpaRepository<CourseAssignment, Long> {
    List<CourseAssignment> findByCourseId(Long courseId);
    List<CourseAssignment> findByTeacherId(Long teacherId);
    Optional<CourseAssignment> findByCourseIdAndTeacherId(Long courseId, Long teacherId);
    boolean existsByCourseIdAndTeacherId(Long courseId, Long teacherId);
    void deleteByCourseIdAndTeacherId(Long courseId, Long teacherId);
    void deleteByCourseId(Long courseId);
}
