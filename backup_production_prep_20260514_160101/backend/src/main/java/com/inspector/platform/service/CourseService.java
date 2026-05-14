package com.inspector.platform.service;

import com.inspector.platform.dto.CourseCreateRequest;
import com.inspector.platform.dto.CourseResponse;
import com.inspector.platform.dto.ModuleRequest;

import java.util.List;

public interface CourseService {

    CourseResponse createCourse(Long inspectorUserId, CourseCreateRequest request);
    CourseResponse getCourseDetail(Long inspectorUserId, Long courseId);
    List<CourseResponse> getInspectorCourses(Long inspectorUserId);
    CourseResponse publishCourse(Long inspectorUserId, Long courseId);
    CourseResponse addModule(Long inspectorUserId, Long courseId, ModuleRequest moduleRequest);
    void assignTeacher(Long inspectorUserId, Long courseId, Long teacherUserId);
    void unassignTeacher(Long inspectorUserId, Long courseId, Long teacherUserId);
    List<CourseResponse> getCourseProgressOverview(Long inspectorUserId, Long courseId);
    void deleteCourse(Long inspectorUserId, Long courseId);
    void deleteModule(Long inspectorUserId, Long courseId, Long moduleId);

    List<CourseResponse> getTeacherCourses(Long teacherUserId);
    CourseResponse getTeacherCourseDetail(Long teacherUserId, Long courseId);
    void markLessonComplete(Long teacherUserId, Long lessonId, Integer score);
}
