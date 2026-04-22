package com.inspector.platform.service.impl;

import com.inspector.platform.service.OnlineMeetingService;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class OnlineMeetingServiceImpl implements OnlineMeetingService {

    @Override
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
