# Sprint 4 Sequence Diagrams: Communication & Governance

## 5.4 Design

### 5.4.1 Sequence Diagrams

This section details the operational logic for the Communication and Governance module. These diagrams illustrate the real-time interaction model of the platform's messaging system and the complex data aggregation workflows used by the analytical "Command Center" dashboard.

**Main Actors and Roles:**
*   **Administrator**: Monitors system-wide performance and geographical trends through the analytics engine.
*   **Inspector / Teacher**: Collaborators who engage in professional dialogue through the real-time messenger.
*   **AnalyticsService**: The engine responsible for cross-referencing user activity, geographical data, and pedagogical results to generate high-level KPIs.
*   **WebSocket / STOMP Broker**: Facilitates instantaneous message delivery without the need for manual page refreshes or polling.
*   **MessengerService**: Manages the persistence of conversations and handles professional contact matching logic.

---

## 1. Real-Time Messaging Sequence (WebSocket/STOMP)
Illustrates how the platform establishes a persistent connection to enable instantaneous communication between pedagogical collaborators.

```mermaid
sequenceDiagram
    actor USER_A as Sender (Inspector)
    participant FE as React / Mobile UI
    participant WS as WebSocket / STOMP Broker
    participant MC as MessengerController
    participant MS as MessengerServiceImpl
    participant DB as MySQL Database
    actor USER_B as Recipient (Teacher)

    Note over FE, WS: WebSocket Handshake with JWT
    FE->>WS: Connect to /ws (Bearer Token)
    WS-->>FE: STOMP CONNECTED

    FE->>WS: Subscribe to /topic/conversation.{id}
    
    USER_A->>FE: Input message and click Send
    FE->>MC: sendMessage(recipientId, content)
    MC->>MS: sendMessage(senderId, recipientId, content)
    
    MS->>DB: Save Message & Update Conversation
    
    rect rgb(240, 255, 240)
        Note right of MS: Real-time broadcast
        MS->>WS: convertAndSend(/topic/conversation.{id}, MessageDto)
        WS-->>FE: [Push] New Message Received
        FE-->>USER_B: Display message instantly
    end

    MC-->>FE: HTTP 200 (Acknowledgement)
    FE-->>USER_A: Show message in "Sent" state
```

---

## 2. title:Admin Analytics & KPI Filtering Sequence
Details the multi-layered data aggregation process that powers the Governance dashboard, allowing Administrators to drill down into regional performance.

```mermaid
sequenceDiagram
    actor ADM as Administrator
    participant FE as React Dashboard
    participant AC as AnalyticsController
    participant AS as AnalyticsService
    participant UR as UserRepository
    participant AR as ActivityRepository
    participant RR as ReportRepository
    participant DB as MySQL Database

    ADM->>FE: Select Region/Delegation Filter
    FE->>AC: getAdminKpis(subject, regionId, delegationId)
    AC->>AS: getAdminAnalytics(subject, regionId, delegationId)
    
    AS->>UR: countActiveUsersByJurisdiction(...)
    UR-->>AS: User Count Data
    
    AS->>AR: countActivitiesByJurisdiction(...)
    AR-->>AS: Activity Volume Data
    
    AS->>RR: getAverageScoresByJurisdiction(...)
    RR-->>AS: Performance Metric Data
    
    AS->>DB: Aggregate statistics into AdminAnalyticsDto
    
    AS-->>AC: AdminAnalyticsDto
    AC-->>FE: HTTP 200 (JSON Dataset)
    FE-->>ADM: Render interactive charts & rankings
```

---

## 3. Professional Contact Discovery Sequence
Shows the automated matching logic that ensures users only see relevant collaborators within their professional scope.

```mermaid
sequenceDiagram
    actor USER as User (Inspector/Teacher)
    participant FE as React Messenger UI
    participant MC as MessengerController
    participant MS as MessengerServiceImpl
    participant PR as ProfileRepository
    participant DB as MySQL Database

    USER->>FE: Open "Contacts" Tab
    FE->>MC: getContacts()
    MC->>MS: getContacts(currentUserId)
    
    MS->>PR: findCollaboratorsInSameDelegation(...)
    PR->>DB: Filter by Role, Delegation, and Subject
    DB-->>PR: List of User Entities
    
    MS->>MS: Map to ContactDto (Name, Role, Avatar)
    MS-->>MC: List<ContactDto>
    MC-->>FE: HTTP 200 OK
    FE-->>USER: Display filtered professional contacts
```
