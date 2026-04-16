package com.inspector.platform.service;

import com.inspector.platform.dto.ConversationDto;
import com.inspector.platform.dto.MessageDto;
import com.inspector.platform.entity.*;
import com.inspector.platform.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessengerService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final InspectorProfileRepository inspectorProfileRepository;
    private final TeacherProfileRepository teacherProfileRepository;

    public List<ConversationDto> getConversations(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return conversationRepository.findAllByUserOrderByLastMessageTimeDesc(user).stream()
                .map(c -> mapToConversationDto(c, userId))
                .collect(Collectors.toList());
    }

    public List<MessageDto> getMessages(Long conversationId, Long userId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conversation not found"));

        if (!conversation.getUser1().getId().equals(userId) && !conversation.getUser2().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your conversation");
        }

        // Mark messages as read
        User user = userRepository.getReferenceById(userId);
        List<Message> unread = messageRepository.findByConversationAndSenderNotAndIsRead(conversation, user, false);
        if (!unread.isEmpty()) {
            unread.forEach(m -> m.setRead(true));
            messageRepository.saveAll(unread);
        }

        return messageRepository.findByConversationIdOrderByTimestampAsc(conversationId).stream()
                .map(this::mapToMessageDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public MessageDto sendMessage(Long senderId, Long recipientId, String content, String fileUrl, String fileName, String fileType) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sender not found"));
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipient not found"));

        Conversation conversation = conversationRepository.findBetweenUsers(sender, recipient)
                .orElseGet(() -> conversationRepository.save(Conversation.builder()
                        .user1(sender)
                        .user2(recipient)
                        .lastMessageTime(LocalDateTime.now())
                        .build()));

        conversation.setLastMessageTime(LocalDateTime.now());
        conversationRepository.save(conversation);

        Message message = Message.builder()
                .conversation(conversation)
                .sender(sender)
                .content(content)
                .timestamp(LocalDateTime.now())
                .isRead(false)
                .fileUrl(fileUrl)
                .fileName(fileName)
                .fileType(fileType)
                .build();

        return mapToMessageDto(messageRepository.save(message));
    }

    private ConversationDto mapToConversationDto(Conversation c, Long currentUserId) {
        User otherUser = c.getUser1().getId().equals(currentUserId) ? c.getUser2() : c.getUser1();
        String name = getFullName(otherUser);
        
        // Get last message content
        List<Message> messages = messageRepository.findByConversationIdOrderByTimestampAsc(c.getId());
        String lastMsg = messages.isEmpty() ? "" : messages.get(messages.size() - 1).getContent();
        if (lastMsg.isEmpty() && !messages.isEmpty() && messages.get(messages.size() - 1).getFileUrl() != null) {
            lastMsg = "[File Attachment]";
        }

        long unreadCount = messageRepository.countByConversationAndSenderNotAndIsRead(c, userRepository.getReferenceById(currentUserId), false);

        return ConversationDto.builder()
                .id(c.getId())
                .otherUserId(otherUser.getId())
                .otherUserName(name)
                .otherUserRole(otherUser.getRole().name())
                .lastMessage(lastMsg)
                .lastMessageTime(c.getLastMessageTime())
                .unreadCount(unreadCount)
                .build();
    }

    private MessageDto mapToMessageDto(Message m) {
        return MessageDto.builder()
                .id(m.getId())
                .conversationId(m.getConversation().getId())
                .senderId(m.getSender().getId())
                .senderName(getFullName(m.getSender()))
                .content(m.getContent())
                .timestamp(m.getTimestamp())
                .isRead(m.isRead())
                .fileUrl(m.getFileUrl())
                .fileName(m.getFileName())
                .fileType(m.getFileType())
                .build();
    }

    private String getFullName(User user) {
        if (user.getRole() == Role.INSPECTOR) {
            return inspectorProfileRepository.findByUserId(user.getId())
                    .map(p -> p.getFirstName() + " " + p.getLastName())
                    .orElse(user.getEmail());
        } else {
            return teacherProfileRepository.findByUserId(user.getId())
                    .map(p -> p.getFirstName() + " " + p.getLastName())
                    .orElse(user.getEmail());
        }
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getContacts(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.getRole() == Role.INSPECTOR) {
            return inspectorProfileRepository.findByUserId(userId).map(p -> {
                if (p.getDelegation() == null || p.getSubject() == null) return List.<Map<String, Object>>of();
                
                return teacherProfileRepository.findAll().stream()
                        .filter(t -> t.getDelegation() != null && 
                                    t.getDelegation().getId().equals(p.getDelegation().getId()) && 
                                    t.getSubject() != null && 
                                    t.getSubject().equals(p.getSubject()))
                        .map(t -> {
                            Map<String, Object> contact = new java.util.HashMap<>();
                            contact.put("id", t.getUser() != null ? t.getUser().getId() : null);
                            contact.put("name", t.getFirstName() + " " + t.getLastName());
                            contact.put("role", "TEACHER");
                            contact.put("details", t.getEtablissement() != null ? t.getEtablissement().getName() : "");
                            return contact;
                        })
                        .filter(m -> m.get("id") != null)
                        .collect(Collectors.toList());
            }).orElse(List.of());
        } else if (user.getRole() == Role.TEACHER) {
            return teacherProfileRepository.findByUserId(userId).map(p -> {
                if (p.getDelegation() == null || p.getSubject() == null) return List.<Map<String, Object>>of();
                
                return inspectorProfileRepository.findAll().stream()
                        .filter(i -> i.getDelegation() != null && 
                                    i.getDelegation().getId().equals(p.getDelegation().getId()) && 
                                    i.getSubject() != null && 
                                    i.getSubject().equals(p.getSubject()))
                        .map(i -> {
                            Map<String, Object> contact = new java.util.HashMap<>();
                            contact.put("id", i.getUser() != null ? i.getUser().getId() : null);
                            contact.put("name", i.getFirstName() + " " + i.getLastName());
                            contact.put("role", "INSPECTOR");
                            contact.put("details", i.getRank() != null ? i.getRank().name() : "");
                            return contact;
                        })
                        .filter(m -> m.get("id") != null)
                        .collect(Collectors.toList());
            }).orElse(List.of());
        }
        
        return List.of();
    }
}
