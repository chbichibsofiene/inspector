package com.inspector.platform.service;

import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class OnlineMeetingService {

    /**
     * Generates a unique Jitsi Meet URL for an activity.
     * @param activityTitle The title of the activity
     * @param activityId The ID of the activity
     * @return A secure Jitsi Meet URL
     */
    public String generateJitsiUrl(String activityTitle, Long activityId) {
        // Clean up title for URL
        String cleanTitle = activityTitle.replaceAll("[^a-zA-Z0-9]", "-");
        // Combine with ID and a random UUID segment for security/uniqueness
        String roomName = String.format("Inspector-%s-%d-%s", 
            cleanTitle, 
            activityId, 
            UUID.randomUUID().toString().substring(0, 8)
        );
        
        return "https://meet.jit.si/" + roomName + "#config.startWithAudioMuted=true&config.startWithVideoMuted=true";
    }
}
