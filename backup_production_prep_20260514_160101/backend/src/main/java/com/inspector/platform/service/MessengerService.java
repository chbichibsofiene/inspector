package com.inspector.platform.service;

import com.inspector.platform.dto.ConversationDto;
import com.inspector.platform.dto.MessageDto;

import java.util.List;
import java.util.Map;

public interface MessengerService {
    List<ConversationDto> getConversations(Long userId);
    List<MessageDto> getMessages(Long conversationId, Long userId);
    MessageDto sendMessage(Long senderId, Long recipientId, String content, String fileUrl, String fileName, String fileType);
    List<Map<String, Object>> getContacts(Long userId);
}
