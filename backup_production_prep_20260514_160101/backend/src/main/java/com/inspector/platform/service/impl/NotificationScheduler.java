package com.inspector.platform.service.impl;

import com.inspector.platform.entity.Activity;
import com.inspector.platform.repository.ActivityRepository;
import com.inspector.platform.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationScheduler {

    private final ActivityRepository activityRepository;
    private final NotificationService notificationService;

    // Run every 10 minutes
    @Scheduled(fixedRate = 600000)
    @Transactional
    public void notifyUpcomingActivities() {
        LocalDateTime now = LocalDateTime.now();
        // Look for activities starting between 1 hour 50 minutes and 2 hours 10 minutes from now
        LocalDateTime startWindow = now.plusHours(1).plusMinutes(50);
        LocalDateTime endWindow = now.plusHours(2).plusMinutes(10);

        List<Activity> upcoming = activityRepository.findUpcomingActivitiesForReminder(startWindow, endWindow);

        if (!upcoming.isEmpty()) {
            log.info("Found {} upcoming activities. Sending 2-hour reminders...", upcoming.size());
            for (Activity activity : upcoming) {
                try {
                    // Notify Inspector
                    notificationService.sendNotification(
                            activity.getInspector().getId(),
                            "Upcoming Activity Reminder",
                            "Your activity '" + activity.getTitle() + "' is starting in 2 hours.",
                            "ACTIVITY_REMINDER",
                            "/inspector/calendar"
                    );

                    // Notify Teachers (Guests)
                    if (activity.getGuests() != null) {
                        for (com.inspector.platform.entity.TeacherProfile guest : activity.getGuests()) {
                            notificationService.sendNotification(
                                    guest.getUser().getId(),
                                    "Upcoming Activity Reminder",
                                    "Your activity '" + activity.getTitle() + "' is starting in 2 hours.",
                                    "ACTIVITY_REMINDER",
                                    "/teacher/calendar"
                            );
                        }
                    }

                    // Mark as sent
                    activity.setReminderSent(true);
                    activityRepository.save(activity);
                } catch (Exception e) {
                    log.error("Failed to send reminder for activity {}: {}", activity.getId(), e.getMessage());
                }
            }
        }
    }
}
