package com.inspector.platform.repository;

import com.inspector.platform.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByInspectorIdOrderByStartDateTimeAsc(Long inspectorId);
    @Query("SELECT DISTINCT a FROM Activity a " +
            "LEFT JOIN FETCH a.guests g " +
            "LEFT JOIN FETCH g.user " +
            "LEFT JOIN FETCH g.etablissement " +
            "WHERE g.user.id = :userId " +
            "ORDER BY a.startDateTime ASC")
    List<Activity> findTeacherActivities(@Param("userId") Long userId);

    @Query("SELECT a FROM Activity a WHERE a.startDateTime BETWEEN :start AND :end AND a.isReminderSent = false")
    List<Activity> findUpcomingActivitiesForReminder(@Param("start") java.time.LocalDateTime start, @Param("end") java.time.LocalDateTime end);
}
