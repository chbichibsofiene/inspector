package com.inspector.platform.repository;

import com.inspector.platform.entity.Inspection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface InspectionRepository extends JpaRepository<Inspection, Long> {

    @Query("SELECT i.delegation.region.name as region, AVG(i.score) as avgScore, COUNT(i) as total " +
           "FROM Inspection i GROUP BY i.delegation.region.name")
    List<Map<String, Object>> getAvgScorePerRegion();

    @Query("SELECT i.delegation.name as delegation, AVG(i.score) as avgScore, COUNT(i) as total " +
           "FROM Inspection i GROUP BY i.delegation.name ORDER BY avgScore DESC")
    List<Map<String, Object>> getDelegationRanking();

    @Query("SELECT i.inspector.email as name, COUNT(i) as activityCount " +
           "FROM Inspection i GROUP BY i.inspector.id, i.inspector.email ORDER BY activityCount DESC")
    List<Map<String, Object>> getMostActiveInspectors();
}
