package com.inspector.platform.repository;

import com.inspector.platform.entity.Course;
import com.inspector.platform.entity.CourseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByInspectorIdOrderByCreatedAtDesc(Long inspectorId);

    List<Course> findByInspectorIdAndStatusOrderByCreatedAtDesc(Long inspectorId, CourseStatus status);

    @Query("SELECT DISTINCT c FROM Course c JOIN c.assignments a WHERE a.teacher.id = :teacherId ORDER BY c.createdAt DESC")
    List<Course> findByAssignedTeacherId(@Param("teacherId") Long teacherId);
}
