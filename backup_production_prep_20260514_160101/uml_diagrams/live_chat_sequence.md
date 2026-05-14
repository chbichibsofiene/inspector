# Live Chat Feature Sequence Diagram

This sequence diagram documents the implemented Messenger flow for Inspector/Teacher communication. The current implementation uses authenticated REST APIs plus periodic polling from the frontend to refresh conversations and messages.

## Sequence 1: Open Messenger And Load Data

```mermaid
sequenceDiagram
    title: Live Chat - Open Messenger And Load Conversations
    autonumber
    actor USER as User (Inspector/Teacher)
    participant FE as React Messenger UI
    participant API as messagesApi / HTTP Client
    participant MC as MessengerController
    participant MS as MessengerService
    participant UR as UserRepository
    participant CR as ConversationRepository
    participant MR as MessageRepository
    participant DB as Database

    USER->>FE: Open Messenger page
    FE->>API: getConversations()
    API->>MC: getConversations(userId)
    MC->>UR: findByEmail(authentication.name)
    UR->>DB: Query current user
    DB-->>UR: User
    MC->>MS: getConversations(userId)
    MS->>UR: findById(userId)
    UR->>DB: Query user
    DB-->>UR: User
    MS->>CR: findAllByUserOrderByLastMessageTimeDesc(user)
    CR->>DB: Query conversations
    DB-->>CR: Conversation list

    loop For each conversation
        MS->>MR: findByConversationIdOrderByTimestampAsc(conversationId)
        MR->>DB: Query messages
        DB-->>MR: Messages
        MS->>MR: countByConversationAndSenderNotAndIsRead(...)
        MR->>DB: Count unread messages
        DB-->>MR: unreadCount
    end

    MS-->>MC: List<ConversationDto>
    MC-->>API: 200 OK ApiResponse("Conversations retrieved")
    API-->>FE: conversations

    par Load eligible contacts
        FE->>API: getContacts()
        API->>MC: getContacts(userId)
        MC->>MS: getContacts(userId)
        MS->>DB: Query matching inspector/teacher profiles by role, delegation, subject
        DB-->>MS: Contact list
        MS-->>MC: contacts
        MC-->>API: 200 OK ApiResponse("Contacts retrieved")
        API-->>FE: contacts
    end

    FE-->>USER: Display chat list, contacts, unread indicators
```

## Sequence 2: Select Conversation And Mark Messages As Read

```mermaid
sequenceDiagram
    title: Live Chat - Select Conversation
    autonumber
    actor USER as User (Inspector/Teacher)
    participant FE as React Messenger UI
    participant API as messagesApi / HTTP Client
    participant MC as MessengerController
    participant MS as MessengerService
    participant UR as UserRepository
    participant CR as ConversationRepository
    participant MR as MessageRepository
    participant DB as Database

    USER->>FE: Select existing conversation
    FE->>API: getMessages(conversationId)
    API->>MC: GET /api/messages/conversations/{id}
    MC->>UR: findByEmail(authentication.name)
    UR->>DB: Query current user
    DB-->>UR: User
    MC->>MS: getMessages(conversationId, userId)
    MS->>CR: findById(conversationId)
    CR->>DB: Query conversation
    DB-->>CR: Conversation

    alt User is not participant
        MS-->>MC: 403 Forbidden
        MC-->>API: Error response
        API-->>FE: error
        FE-->>USER: Keep previous view / log error
    else User is participant
        MS->>MR: findByConversationAndSenderNotAndIsRead(conversation, currentUser, false)
        MR->>DB: Query unread messages from other user
        DB-->>MR: Unread messages
        opt Unread messages exist
            MS->>MR: saveAll(messages marked read)
            MR->>DB: Update isRead = true
            DB-->>MR: Updated messages
        end
        MS->>MR: findByConversationIdOrderByTimestampAsc(conversationId)
        MR->>DB: Query ordered messages
        DB-->>MR: Message list
        MS-->>MC: List<MessageDto>
        MC-->>API: 200 OK ApiResponse("Messages retrieved")
        API-->>FE: messages
        FE-->>USER: Render conversation thread and scroll to bottom
    end
```

## Sequence 3: Send Text Message

```mermaid
sequenceDiagram
    title: Live Chat - Send Text Message
    autonumber
    actor SENDER as Sender
    participant FE as React Messenger UI
    participant API as messagesApi / HTTP Client
    participant MC as MessengerController
    participant MS as MessengerService
    participant UR as UserRepository
    participant CR as ConversationRepository
    participant MR as MessageRepository
    participant NS as NotificationService
    participant NR as NotificationRepository
    participant DB as Database
    actor RECIPIENT as Recipient

    SENDER->>FE: Type message and click Send
    FE->>FE: Validate non-empty content
    FE->>API: sendMessage(recipientId, content)
    API->>MC: POST /api/messages {recipientId, content}
    MC->>UR: findByEmail(authentication.name)
    UR->>DB: Query sender by authenticated email
    DB-->>UR: Sender User
    MC->>MS: sendMessage(senderId, recipientId, content, null, null, null)

    MS->>UR: findById(senderId)
    UR->>DB: Query sender
    DB-->>UR: Sender
    MS->>UR: findById(recipientId)
    UR->>DB: Query recipient
    DB-->>UR: Recipient

    MS->>CR: findBetweenUsers(sender, recipient)
    CR->>DB: Query existing conversation
    DB-->>CR: Optional<Conversation>

    alt Conversation does not exist
        MS->>CR: save(new Conversation(sender, recipient, now))
        CR->>DB: Insert conversation
        DB-->>CR: Conversation
    else Conversation exists
        MS->>CR: save(conversation with updated lastMessageTime)
        CR->>DB: Update lastMessageTime
        DB-->>CR: Conversation
    end

    MS->>MR: save(Message(content, sender, conversation, isRead=false))
    MR->>DB: Insert message
    DB-->>MR: Saved message

    MS->>NS: sendNotification(recipientId, "New Message", ..., "NEW_MESSAGE", "/messages")
    NS->>NR: save(Notification)
    NR->>DB: Insert notification
    DB-->>NR: Saved notification
    NS-->>MS: notification sent

    MS-->>MC: MessageDto
    MC-->>API: 200 OK ApiResponse("Message sent")
    API-->>FE: sent message
    FE->>FE: Append message to local thread, clear input
    FE->>API: getConversations()
    API->>MC: GET /api/messages/conversations
    MC-->>API: Updated conversation list
    API-->>FE: conversations
    FE-->>SENDER: Display sent message immediately

    Note over RECIPIENT, FE: Recipient sees the new message when notifications are checked or when Messenger polling refreshes the thread.
```

## Sequence 4: Send File Attachment

```mermaid
sequenceDiagram
    title: Live Chat - Send File Attachment
    autonumber
    actor SENDER as Sender
    participant FE as React Messenger UI
    participant API as messagesApi / HTTP Client
    participant MC as MessengerController
    participant FS as FileStorageService
    participant DISK as Upload Directory
    participant MS as MessengerService
    participant DB as Database
    participant NS as NotificationService

    SENDER->>FE: Click Attach and choose file
    FE->>FE: Set uploading = true
    FE->>API: uploadFile(file)
    API->>MC: POST /api/messages/upload multipart/form-data
    MC->>FS: storeFile(file)
    FS->>DISK: Save UUID_originalFilename
    DISK-->>FS: Stored file path
    FS-->>MC: stored file name
    MC-->>API: 200 OK {fileUrl, fileName, fileType}
    API-->>FE: upload metadata

    FE->>API: sendMessage(recipientId, "", fileUrl, fileName, fileType)
    API->>MC: POST /api/messages attachment payload
    MC->>MS: sendMessage(senderId, recipientId, "", fileUrl, fileName, fileType)
    MS->>DB: Find or create conversation
    MS->>DB: Save Message with attachment metadata
    MS->>NS: sendNotification(recipientId, "New Message", ...)
    NS->>DB: Save notification
    MS-->>MC: MessageDto
    MC-->>API: 200 OK ApiResponse("Message sent")
    API-->>FE: attachment message
    FE->>FE: Append file/image message and reload conversations
    FE-->>SENDER: Display attachment in chat
```

## Sequence 5: Real-Time WebSocket Updates (STOMP)

```mermaid
sequenceDiagram
    title: Live Chat - Real-Time Updates via STOMP
    autonumber
    participant FE as React Messenger UI
    participant WS as WebSocket Config / STOMP
    participant MS as MessengerServiceImpl
    participant DB as Database
    actor RECIPIENT as Recipient
    actor SENDER as Sender

    FE->>WS: Connect to /ws (Bearer Token)
    Note over FE, WS: WebSocket Handshake & JWT Validation
    WS-->>FE: CONNECTED

    opt Conversation Selected
        FE->>WS: Subscribe to /topic/conversation.{id}
    end

    SENDER->>FE: type message and click Send
    FE->>MS: sendMessage(senderId, recipientId, content, ...)
    MS->>DB: Save Message
    
    rect rgb(240, 255, 240)
        Note right of MS: Real-time broadcast
        MS->>WS: convertAndSend(/topic/conversation.{id}, MessageDto)
        WS-->>FE: [STOMP Message] /topic/conversation.{id}
        FE-->>RECIPIENT: New message appears instantly
    end

    WS-->>FE: [STOMP Message] /topic/conversation.{id}
    FE-->>SENDER: Message status/echo updated
```

## Key Implementation Notes

| Concern | Implemented behavior |
| :--- | :--- |
| Authentication | `MessengerController` resolves the current user from `Authentication.getName()` and `UserRepository.findByEmail(...)`. |
| Contact eligibility | Inspectors see teachers with matching delegation and subject; teachers see inspectors with matching delegation and subject. |
| Conversation creation | `MessengerServiceImpl.sendMessage(...)` creates the conversation if no existing conversation is found between both users. |
| Read status | Opening a conversation marks unread messages from the other participant as read. |
| Live update strategy | Real-time messaging implemented via STOMP over WebSocket. Clients subscribe to conversation-specific topics. |
| Attachments | Files are uploaded first through `/api/messages/upload`, then sent as message metadata through `/api/messages`. |
| Notifications | After each message is saved, `SimpMessagingTemplate` broadcasts to the WebSocket topic, and `NotificationService` creates a persistent notification. |
