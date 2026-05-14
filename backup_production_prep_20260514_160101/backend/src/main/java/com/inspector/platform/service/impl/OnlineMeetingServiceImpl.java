package com.inspector.platform.service.impl;

import com.inspector.platform.service.OnlineMeetingService;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
@lombok.RequiredArgsConstructor
public class OnlineMeetingServiceImpl implements OnlineMeetingService {

    private final com.inspector.platform.service.LogService logService;

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
        
        String url = "https://meet.jit.si/" + roomName + "#config.startWithAudioMuted=true&config.startWithVideoMuted=true";
        logService.log(com.inspector.platform.entity.ActionType.CREATE, "Meeting", activityId.toString(), "Generated meeting URL for: " + activityTitle);
        return url;
    }
}
