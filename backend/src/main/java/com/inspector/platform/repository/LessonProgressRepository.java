package com.inspector.platform.repository;

import com.inspector.platform.entity.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {
    Optional<LessonProgress> findByLessonIdAndTeacherId(Long lessonId, Long teacherId);
    List<LessonProgress> findByTeacherId(Long teacherId);

    @Query("SELECT lp FROM LessonProgress lp WHERE lp.teacher.id = :teacherId AND lp.lesson.module.course.id = :courseId")
    List<LessonProgress> findByTeacherIdAndCourseId(@Param("teacherId") Long teacherId, @Param("courseId") Long courseId);

    @Query("SELECT COUNT(lp) FROM LessonProgress lp WHERE lp.teacher.id = :teacherId AND lp.lesson.module.course.id = :courseId AND lp.completed = true")
    long countCompletedByTeacherAndCourse(@Param("teacherId") Long teacherId, @Param("courseId") Long courseId);

    @Query("SELECT COUNT(l) FROM CourseLesson l WHERE l.module.course.id = :courseId")
    long countTotalLessonsInCourse(@Param("courseId") Long courseId);

    void deleteByLessonModuleCourseId(Long courseId);
    void deleteByLessonModuleId(Long moduleId);
    void deleteByLessonId(Long lessonId);
}
