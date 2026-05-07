package com.inspector.platform.service.impl;

import com.inspector.platform.dto.ConversationDto;
import com.inspector.platform.dto.MessageDto;
import com.inspector.platform.entity.*;
import com.inspector.platform.repository.*;
import com.inspector.platform.service.MessengerService;
import com.inspector.platform.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessengerServiceImpl implements MessengerService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final InspectorProfileRepository inspectorProfileRepository;
    private final TeacherProfileRepository teacherProfileRepository;
    private final NotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public List<ConversationDto> getConversations(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return conversationRepository.findAllByUserOrderByLastMessageTimeDesc(user).stream()
                .map(c -> mapToConversationDto(c, userId))
                .collect(Collectors.toList());
    }

    @Override
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

    @Override
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

        Message savedMessage = messageRepository.save(message);
        MessageDto messageDto = mapToMessageDto(savedMessage);

        // Broadcast via WebSocket to both conversation participants
        messagingTemplate.convertAndSend("/topic/conversation." + conversation.getId(), messageDto);

        // Also notify recipient via in-app notification
        notificationService.sendNotification(
                recipientId,
                "New Message",
                "You received a new message from " + getFullName(sender),
                "NEW_MESSAGE",
                "/messages"
        );

        return messageDto;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getContacts(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.getRole() == Role.INSPECTOR) {
            InspectorProfile p = inspectorProfileRepository.findByUserId(userId).orElse(null);
            if (p == null || p.getDelegations() == null || p.getDelegations().isEmpty()) {
                return List.of();
            }
            
            java.util.Set<Long> inspectorDelegationIds = p.getDelegations().stream()
                    .map(Delegation::getId)
                    .collect(Collectors.toSet());

            List<Map<String, Object>> contacts = new java.util.ArrayList<>();

            // 1. Add Teachers in same delegations and same subject
            if (p.getSubject() != null) {
                contacts.addAll(teacherProfileRepository.findAll().stream()
                        .filter(t -> t.getDelegation() != null && 
                                    inspectorDelegationIds.contains(t.getDelegation().getId()) && 
                                    t.getSubject() != null && 
                                    t.getSubject().equals(p.getSubject()))
                        .map(t -> {
                            Map<String, Object> contact = new java.util.HashMap<>();
                            contact.put("id", t.getUser() != null ? t.getUser().getId() : null);
                            contact.put("name", t.getFirstName() + " " + t.getLastName());
                            contact.put("role", "TEACHER");
                            contact.put("details", t.getEtablissement() != null ? t.getEtablissement().getName() : "");
                            contact.put("profileImageUrl", t.getUser() != null ? t.getUser().getProfileImageUrl() : null);
                            return contact;
                        })
                        .filter(m -> m.get("id") != null)
                        .collect(Collectors.toList()));
            }

            // 2. Add Other Inspectors sharing at least one delegation
            contacts.addAll(inspectorProfileRepository.findAll().stream()
                    .filter(i -> !i.getUser().getId().equals(userId)) // Not self
                    .filter(i -> i.getDelegations() != null && 
                                i.getDelegations().stream().anyMatch(d -> inspectorDelegationIds.contains(d.getId())))
                    .map(i -> {
                        Map<String, Object> contact = new java.util.HashMap<>();
                        contact.put("id", i.getUser() != null ? i.getUser().getId() : null);
                        contact.put("name", i.getFirstName() + " " + i.getLastName());
                        contact.put("role", "INSPECTOR");
                        contact.put("details", (i.getRank() != null ? i.getRank().name() : "") + (i.getSubject() != null ? " (" + i.getSubject().name() + ")" : ""));
                        contact.put("profileImageUrl", i.getUser() != null ? i.getUser().getProfileImageUrl() : null);
                        return contact;
                    })
                    .filter(m -> m.get("id") != null)
                    .collect(Collectors.toList()));

            return contacts;

        } else if (user.getRole() == Role.TEACHER) {
            TeacherProfile p = teacherProfileRepository.findByUserId(userId).orElse(null);
            if (p == null || p.getDelegation() == null || p.getSubject() == null) {
                return List.of();
            }
            
            return inspectorProfileRepository.findAll().stream()
                    .filter(i -> i.getDelegations() != null && 
                                i.getDelegations().stream().anyMatch(d -> d.getId().equals(p.getDelegation().getId())) && 
                                i.getSubject() != null && 
                                i.getSubject().equals(p.getSubject()))
                    .map(i -> {
                        Map<String, Object> contact = new java.util.HashMap<>();
                        contact.put("id", i.getUser() != null ? i.getUser().getId() : null);
                        contact.put("name", i.getFirstName() + " " + i.getLastName());
                        contact.put("role", "INSPECTOR");
                        contact.put("details", (i.getRank() != null ? i.getRank().name() : "") + (i.getSubject() != null ? " (" + i.getSubject().name() + ")" : ""));
                        contact.put("profileImageUrl", i.getUser() != null ? i.getUser().getProfileImageUrl() : null);
                        return contact;
                    })
                    .filter(m -> m.get("id") != null)
                    .collect(Collectors.toList());
        }
        
        return List.of();
    }

    private ConversationDto mapToConversationDto(Conversation c, Long currentUserId) {
        User otherUser = c.getUser1().getId().equals(currentUserId) ? c.getUser2() : c.getUser1();
        String name = getFullName(otherUser);
        
        // Get last message info
        List<Message> messages = messageRepository.findByConversationIdOrderByTimestampAsc(c.getId());
        String lastMsg = "";
        Long lastSenderId = null;
        
        if (!messages.isEmpty()) {
            Message last = messages.get(messages.size() - 1);
            lastMsg = last.getContent();
            lastSenderId = last.getSender().getId();
            
            if (lastMsg == null || lastMsg.isEmpty()) {
                if (last.getFileUrl() != null) {
                    lastMsg = "[File Attachment]";
                }
            }
        }

        long unreadCount = messageRepository.countByConversationAndSenderNotAndIsRead(c, userRepository.getReferenceById(currentUserId), false);

        return ConversationDto.builder()
                .id(c.getId())
                .otherUserId(otherUser.getId())
                .otherUserName(name)
                .otherUserRole(otherUser.getRole().name())
                .lastMessage(lastMsg)
                .lastMessageSenderId(lastSenderId)
                .lastMessageTime(c.getLastMessageTime())
                .unreadCount(unreadCount)
                .otherUserProfileImageUrl(otherUser.getProfileImageUrl())
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
}
