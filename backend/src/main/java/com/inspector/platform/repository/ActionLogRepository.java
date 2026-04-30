package com.inspector.platform.repository;

import com.inspector.platform.entity.ActionLog;
import com.inspector.platform.entity.ActionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActionLogRepository extends JpaRepository<ActionLog, Long> {
    
    List<ActionLog> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    @Query("SELECT a FROM ActionLog a WHERE " +
           "(:userId IS NULL OR a.user.id = :userId) AND " +
           "(:actionType IS NULL OR a.actionType = :actionType) AND " +
           "(:startDate IS NULL OR a.createdAt >= :startDate) AND " +
           "(:endDate IS NULL OR a.createdAt <= :endDate) " +
           "ORDER BY a.createdAt DESC")
    List<ActionLog> filterLogs(
            @Param("userId") Long userId,
            @Param("actionType") ActionType actionType,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT COUNT(a) FROM ActionLog a WHERE a.user.id = :userId AND a.createdAt > :since AND a.actionType = :actionType")
    long countRecentActions(@Param("userId") Long userId, @Param("actionType") ActionType actionType, @Param("since") LocalDateTime since);
}
