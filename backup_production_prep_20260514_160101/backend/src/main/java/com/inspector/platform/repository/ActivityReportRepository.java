package com.inspector.platform.repository;

import com.inspector.platform.entity.ActivityReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.inspector.platform.entity.ReportStatus;

import java.util.List;

@Repository
public interface ActivityReportRepository extends JpaRepository<ActivityReport, Long> {
    List<ActivityReport> findByInspectorIdOrderByUpdatedAtDesc(Long inspectorId);
    List<ActivityReport> findByActivityIdAndInspectorIdOrderByUpdatedAtDesc(Long activityId, Long inspectorId);
    List<ActivityReport> findByTeacherUserIdAndStatusOrderByUpdatedAtDesc(Long userId, ReportStatus status);
    java.util.Optional<ActivityReport> findByActivityIdAndTeacherUserId(Long activityId, Long teacherUserId);
    void deleteByActivityId(Long activityId);
    
    @org.springframework.data.jpa.repository.Query("SELECT r.teacher.delegation.region.name as region, AVG(r.score) as avgScore, COUNT(r) as total " +
           "FROM ActivityReport r WHERE r.score IS NOT NULL GROUP BY r.teacher.delegation.region.name")
    List<java.util.Map<String, Object>> getAvgScorePerRegion();

    @org.springframework.data.jpa.repository.Query("SELECT r.teacher.delegation.region.name as region, AVG(r.score) as avgScore, COUNT(r) as total " +
           "FROM ActivityReport r WHERE r.score IS NOT NULL AND r.teacher.subject = :subject GROUP BY r.teacher.delegation.region.name")
    List<java.util.Map<String, Object>> getAvgScorePerRegionBySubject(@org.springframework.data.repository.query.Param("subject") com.inspector.platform.entity.Subject subject);

    @org.springframework.data.jpa.repository.Query("SELECT r.teacher.delegation.name as delegation, AVG(r.score) as avgScore, COUNT(r) as total " +
           "FROM ActivityReport r WHERE r.score IS NOT NULL GROUP BY r.teacher.delegation.name ORDER BY avgScore DESC")
    List<java.util.Map<String, Object>> getDelegationRanking();

    @org.springframework.data.jpa.repository.Query("SELECT r.teacher.delegation.name as delegation, AVG(r.score) as avgScore, COUNT(r) as total " +
           "FROM ActivityReport r WHERE r.score IS NOT NULL AND r.teacher.subject = :subject GROUP BY r.teacher.delegation.name ORDER BY avgScore DESC")
    List<java.util.Map<String, Object>> getDelegationRankingBySubject(@org.springframework.data.repository.query.Param("subject") com.inspector.platform.entity.Subject subject);
}
