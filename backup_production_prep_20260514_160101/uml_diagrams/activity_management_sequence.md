# Activity Management Sequence Diagram (Full CRUD)

This diagram documents the complete lifecycle of a pedagogical activity, including secure updates and cascade deletion logic.

## 🔄 Sequence 1: Activity Creation Flow

```mermaid
sequenceDiagram
    title: Activity Creation Flow
    autonumber
    participant USER as INSPECTOR
    participant FE as FRONT END
    participant AC as ActivityController
    participant AS as ActivityService
    participant OMS as OnlineMeetingService
    participant NS as NotificationService
    participant DB as Data Base

    Note over USER, DB: interaction : activity planning and guest notification

    USER->>FE: 1 : fill activity details (title, dates, type, guests)
    FE->>AC: 2 : createActivity(CreateActivityRequest)
    AC->>AS: 3 : createActivity(inspectorId, request)
    AS->>DB: 4 : findByUserId(inspectorId)
    AS->>DB: 5 : findAllById(guestTeacherIds)
    
    AS->>DB: 6 : Save(Activity)
    
    opt isOnline == true
        AS->>OMS: 7 : generateJitsiUrl(title, activityId)
        OMS-->>AS: 8 : meetingUrl
        AS->>DB: 9 : Save(Activity with URL)
    end

    loop notify guests
        AS->>NS: 10 : sendNotification(guestId, ...)
        NS->>DB: 11 : Save(Notification)
    end

    AS-->>AC: 12 : ActivityResponse
    AC-->>FE: 13 : 201 Created
    FE-->>USER: 14 : display success
```

## 🔄 Sequence 2: Activity Update Flow

```mermaid
sequenceDiagram
    title: Activity Update Flow
    autonumber
    participant USER as INSPECTOR
    participant FE as FRONT END
    participant AC as ActivityController
    participant AS as ActivityService
    participant OMS as OnlineMeetingService
    participant DB as Data Base

    USER->>FE: 1 : modify activity fields
    FE->>AC: 2 : updateActivity(id, request)
    AC->>AS: 3 : updateActivity(inspectorId, activityId, request)
    AS->>DB: 4 : findById(activityId)
    
    rect rgb(255, 240, 240)
        Note right of AS: 5 : verify owner (inspectorId)
    end
    
    alt owner mismatch
        AS-->>AC: 6 : ForbiddenException(403)
        AC-->>FE: 7 : 403 Forbidden
        FE-->>USER: 8 : error message
    end

    Note right of AS: 9 : update fields (title, dates, etc.)

    opt switched to online
        AS->>OMS: 10 : generateJitsiUrl(title, activityId)
        OMS-->>AS: 11 : new meetingUrl
    end

    AS->>DB: 12 : Save(Updated Activity)
    AS-->>AC: 13 : ActivityResponse
    AC-->>FE: 14 : 200 OK
    FE-->>USER: 15 : refresh view
```

## 🔄 Sequence 3: Activity Deletion Flow

```mermaid
sequenceDiagram
    title: Activity Deletion Flow
    autonumber
    participant USER as INSPECTOR
    participant FE as FRONT END
    participant AC as ActivityController
    participant AS as ActivityService
    participant ARR as ActivityReportRepository
    participant DB as Data Base

    USER->>FE: 1 : click delete activity
    FE->>AC: 2 : deleteActivity(id)
    AC->>AS: 3 : deleteActivity(inspectorId, activityId)
    AS->>DB: 4 : findById(activityId) & verify owner
    
    Note over AS, ARR: Cascade deletion logic
    AS->>ARR: 5 : deleteByActivityId(activityId)
    ARR->>DB: 6 : Remove linked reports
    
    AS->>DB: 7 : Delete(Activity)
    DB-->>AS: 8 : void
    AS-->>AC: 9 : void
    AC-->>FE: 10 : 200 OK
    FE-->>USER: 11 : remove from calendar
```

## 📋 Key Operations

| Operation | Component | Security/Logic |
| :--- | :--- | :--- |
| **Update** | `ActivityService` | Implements a **Forbidden Check** to ensure only the creator can modify an activity. |
| **Online Toggle** | `OnlineMeetingService` | Dynamically provisions a Jitsi room if an activity is moved from "Physical" to "Online". |
| **Deletion** | `ActivityReportRepository` | Handles **Foreign Key constraints** by removing associated reports before deleting the parent activity. |
