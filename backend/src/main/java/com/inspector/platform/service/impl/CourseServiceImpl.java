package com.inspector.platform.service.impl;

import com.inspector.platform.dto.*;
import com.inspector.platform.entity.*;
import com.inspector.platform.repository.*;
import com.inspector.platform.service.CourseService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final CourseModuleRepository moduleRepository;
    private final CourseLessonRepository lessonRepository;
    private final CourseAssignmentRepository assignmentRepository;
    private final LessonProgressRepository progressRepository;
    private final InspectorProfileRepository inspectorProfileRepository;
    private final TeacherProfileRepository teacherProfileRepository;

    // ─── Inspector Operations ─────────────────────────────────────────────────

    @Override
    @Transactional
    public CourseResponse createCourse(Long inspectorUserId, CourseCreateRequest request) {
        InspectorProfile inspector = inspectorProfileRepository.findByUserId(inspectorUserId)
                .orElseThrow(() -> new RuntimeException("Inspector profile not found"));

        Course course = Course.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .subject(request.getSubject())
                .inspector(inspector)
                .status(CourseStatus.DRAFT)
                .build();

        if (request.getModules() != null) {
            int modIdx = 0;
            for (ModuleRequest mr : request.getModules()) {
                CourseModule module = buildModule(mr, course, modIdx++);
                course.getModules().add(module);
            }
        }

        Course saved = courseRepository.save(course);
        return toCourseResponse(saved, null);
    }

    @Override
    public List<CourseResponse> getInspectorCourses(Long inspectorUserId) {
        InspectorProfile inspector = inspectorProfileRepository.findByUserId(inspectorUserId)
                .orElseThrow(() -> new RuntimeException("Inspector profile not found"));
        return courseRepository.findByInspectorIdOrderByCreatedAtDesc(inspector.getId())
                .stream()
                .map(c -> toCourseResponse(c, null))
                .collect(Collectors.toList());
    }

    @Override
    public CourseResponse getCourseDetail(Long inspectorUserId, Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return toCourseResponseWithModules(course, null);
    }

    @Override
    @Transactional
    public CourseResponse publishCourse(Long inspectorUserId, Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        course.setStatus(CourseStatus.PUBLISHED);
        return toCourseResponse(courseRepository.save(course), null);
    }

    @Override
    @Transactional
    public CourseResponse addModule(Long inspectorUserId, Long courseId, ModuleRequest moduleRequest) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        int nextIdx = course.getModules().size();
        CourseModule module = buildModule(moduleRequest, course, nextIdx);
        course.getModules().add(module);
        return toCourseResponseWithModules(courseRepository.save(course), null);
    }

    @Override
    @Transactional
    public void assignTeacher(Long inspectorUserId, Long courseId, Long teacherUserId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        TeacherProfile teacher = teacherProfileRepository.findByUserId(teacherUserId)
                .orElseThrow(() -> new RuntimeException("Teacher profile not found"));

        if (!assignmentRepository.existsByCourseIdAndTeacherId(courseId, teacher.getId())) {
            CourseAssignment assignment = CourseAssignment.builder()
                    .course(course)
                    .teacher(teacher)
                    .assignedAt(LocalDateTime.now())
                    .build();
            assignmentRepository.save(assignment);
        }
    }

    @Override
    @Transactional
    public void unassignTeacher(Long inspectorUserId, Long courseId, Long teacherUserId) {
        TeacherProfile teacher = teacherProfileRepository.findByUserId(teacherUserId)
                .orElseThrow(() -> new RuntimeException("Teacher profile not found"));
        assignmentRepository.deleteByCourseIdAndTeacherId(courseId, teacher.getId());
    }

    @Override
    public List<CourseResponse> getCourseProgressOverview(Long inspectorUserId, Long courseId) {
        List<CourseAssignment> assignments = assignmentRepository.findByCourseId(courseId);
        long totalLessons = progressRepository.countTotalLessonsInCourse(courseId);
        return assignments.stream().map(a -> {
            TeacherProfile t = a.getTeacher();
            long completed = progressRepository.countCompletedByTeacherAndCourse(t.getId(), courseId);
            int pct = totalLessons == 0 ? 0 : (int) (completed * 100 / totalLessons);
            return CourseResponse.builder()
                    .id(t.getId())
                    .title(t.getFirstName() + " " + t.getLastName())
                    .description(t.getUser().getEmail())
                    .completedLessons((int) completed)
                    .totalLessons((int) totalLessons)
                    .progressPercent(pct)
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteCourse(Long inspectorUserId, Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        if (!course.getInspector().getUser().getId().equals(inspectorUserId)) {
            throw new RuntimeException("Unauthorized: You do not own this course");
        }
        
        // Clean up everything related to this course
        progressRepository.deleteByLessonModuleCourseId(courseId);
        assignmentRepository.deleteByCourseId(courseId);
        courseRepository.delete(course);
    }

    @Override
    @Transactional
    public void deleteModule(Long inspectorUserId, Long courseId, Long moduleId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        if (!course.getInspector().getUser().getId().equals(inspectorUserId)) {
            throw new RuntimeException("Unauthorized: You do not own this course");
        }
        
        CourseModule module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found"));
        
        if (!module.getCourse().getId().equals(courseId)) {
            throw new RuntimeException("Module does not belong to this course");
        }
        
        // Clean up progress for lessons in this module
        progressRepository.deleteByLessonModuleId(moduleId);
        
        course.getModules().remove(module);
        moduleRepository.delete(module);
    }

    // ─── Teacher Operations ───────────────────────────────────────────────────

    @Override
    public List<CourseResponse> getTeacherCourses(Long teacherUserId) {
        TeacherProfile teacher = teacherProfileRepository.findByUserId(teacherUserId)
                .orElseThrow(() -> new RuntimeException("Teacher profile not found"));
        return courseRepository.findByAssignedTeacherId(teacher.getId())
                .stream()
                .filter(c -> c.getStatus() == CourseStatus.PUBLISHED)
                .map(c -> toCourseResponseWithProgress(c, teacher.getId()))
                .collect(Collectors.toList());
    }

    @Override
    public CourseResponse getTeacherCourseDetail(Long teacherUserId, Long courseId) {
        TeacherProfile teacher = teacherProfileRepository.findByUserId(teacherUserId)
                .orElseThrow(() -> new RuntimeException("Teacher profile not found"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return toCourseResponseWithModulesAndProgress(course, teacher.getId());
    }

    @Override
    @Transactional
    public void markLessonComplete(Long teacherUserId, Long lessonId, Integer score) {
        TeacherProfile teacher = teacherProfileRepository.findByUserId(teacherUserId)
                .orElseThrow(() -> new RuntimeException("Teacher profile not found"));
        CourseLesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        LessonProgress progress = progressRepository
                .findByLessonIdAndTeacherId(lessonId, teacher.getId())
                .orElse(LessonProgress.builder().lesson(lesson).teacher(teacher).build());

        progress.setCompleted(true);
        progress.setCompletedAt(LocalDateTime.now());
        if (score != null) progress.setScore(score);
        progressRepository.save(progress);
    }

    // ─── Private Helpers ──────────────────────────────────────────────────────

    private CourseModule buildModule(ModuleRequest mr, Course course, int idx) {
        CourseModule module = CourseModule.builder()
                .title(mr.getTitle())
                .description(mr.getDescription())
                .orderIndex(mr.getOrderIndex() != null ? mr.getOrderIndex() : idx)
                .course(course)
                .build();
        if (mr.getLessons() != null) {
            int lesIdx = 0;
            for (LessonRequest lr : mr.getLessons()) {
                CourseLesson lesson = CourseLesson.builder()
                        .title(lr.getTitle())
                        .type(lr.getType())
                        .contentUrl(lr.getContentUrl())
                        .description(lr.getDescription())
                        .durationMinutes(lr.getDurationMinutes())
                        .orderIndex(lr.getOrderIndex() != null ? lr.getOrderIndex() : lesIdx)
                        .module(module)
                        .build();
                module.getLessons().add(lesson);
                lesIdx++;
            }
        }
        return module;
    }

    private CourseResponse toCourseResponse(Course c, Long teacherId) {
        int totalLessons = c.getModules().stream().mapToInt(m -> m.getLessons().size()).sum();
        CourseResponse.CourseResponseBuilder builder = CourseResponse.builder()
                .id(c.getId())
                .title(c.getTitle())
                .description(c.getDescription())
                .subject(c.getSubject())
                .status(c.getStatus())
                .inspectorName(c.getInspector().getFirstName() + " " + c.getInspector().getLastName())
                .totalModules(c.getModules().size())
                .totalLessons(totalLessons)
                .assignedTeachers(c.getAssignments().size())
                .createdAt(c.getCreatedAt());
        if (teacherId != null) {
            long completed = progressRepository.countCompletedByTeacherAndCourse(teacherId, c.getId());
            int pct = totalLessons == 0 ? 0 : (int) (completed * 100 / totalLessons);
            builder.completedLessons((int) completed).progressPercent(pct);
        }
        return builder.build();
    }

    private CourseResponse toCourseResponseWithProgress(Course c, Long teacherId) {
        return toCourseResponse(c, teacherId);
    }

    private CourseResponse toCourseResponseWithModules(Course c, Long teacherId) {
        CourseResponse base = toCourseResponse(c, teacherId);
        base.setModules(c.getModules().stream()
                .map(m -> toModuleResponse(m, teacherId))
                .collect(Collectors.toList()));
        return base;
    }

    private CourseResponse toCourseResponseWithModulesAndProgress(Course c, Long teacherId) {
        return toCourseResponseWithModules(c, teacherId);
    }

    private ModuleResponse toModuleResponse(CourseModule m, Long teacherId) {
        List<LessonResponse> lessons = m.getLessons().stream()
                .map(l -> toLessonResponse(l, teacherId))
                .collect(Collectors.toList());
        int completed = (int) lessons.stream().filter(LessonResponse::isCompleted).count();
        return ModuleResponse.builder()
                .id(m.getId())
                .title(m.getTitle())
                .description(m.getDescription())
                .orderIndex(m.getOrderIndex())
                .lessons(lessons)
                .completedLessons(completed)
                .totalLessons(lessons.size())
                .build();
    }

    private LessonResponse toLessonResponse(CourseLesson l, Long teacherId) {
        LessonResponse.LessonResponseBuilder builder = LessonResponse.builder()
                .id(l.getId())
                .title(l.getTitle())
                .type(l.getType())
                .contentUrl(l.getContentUrl())
                .description(l.getDescription())
                .durationMinutes(l.getDurationMinutes())
                .orderIndex(l.getOrderIndex())
                .completed(false);
        if (teacherId != null) {
            progressRepository.findByLessonIdAndTeacherId(l.getId(), teacherId).ifPresent(p -> {
                builder.completed(p.isCompleted());
                builder.score(p.getScore());
            });
        }
        return builder.build();
    }
}
