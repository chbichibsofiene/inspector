package com.inspector.platform.repository;

import com.inspector.platform.entity.ActivityReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityReportRepository extends JpaRepository<ActivityReport, Long> {
    List<ActivityReport> findByInspectorIdOrderByUpdatedAtDesc(Long inspectorId);
    List<ActivityReport> findByActivityIdAndInspectorIdOrderByUpdatedAtDesc(Long activityId, Long inspectorId);
}
