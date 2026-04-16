package com.inspector.platform.repository;

import com.inspector.platform.entity.Conversation;
import com.inspector.platform.entity.Message;
import com.inspector.platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByConversationIdOrderByTimestampAsc(Long conversationId);
    
    long countByConversationAndSenderNotAndIsRead(Conversation conversation, User sender, boolean isRead);
    
    List<Message> findByConversationAndSenderNotAndIsRead(Conversation conversation, User sender, boolean isRead);
}
