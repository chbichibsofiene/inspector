package com.inspector.platform.service;

import com.inspector.platform.entity.ActionType;
import com.inspector.platform.entity.User;

public interface LogService {
    void log(User user, ActionType actionType, String entityType, String entityId, String description, String ipAddress);
    void log(ActionType actionType, String entityType, String entityId, String description);
}
