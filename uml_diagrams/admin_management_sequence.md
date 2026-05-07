# Admin Management Sequence Diagram

This diagram documents the administrative control plane, which is focused on monitoring and analysis, including user registry oversight, system auditing (Action Logs), and high-level regional analytics.

## 🔄 Sequence 1: User Registry Overview

```mermaid
sequenceDiagram
    title: User Registry Overview
    autonumber
    participant ADMIN as ADMINISTRATOR
    participant FE as FRONT END
    participant AC as AdminController
    participant AS as AdminService
    participant DB as Data Base

    Note over ADMIN, DB: interaction : monitoring the user account registry

    ADMIN->>FE: 1 : navigates to User Management
    FE->>AC: 2 : getAllUsers()
    AC->>AS: 3 : getAllUsers()
    AS->>DB: 4 : select * from users ...
    DB-->>FE: 5 : User List (Profile & Status info)
    FE-->>ADMIN: 6 : display user cards (Read-Only)
```

## 🔄 Sequence 2: System Auditing (Action Logs)

```mermaid
sequenceDiagram
    title: System Auditing (Action Logs)
    autonumber
    participant ADMIN as ADMINISTRATOR
    participant FE as FRONT END
    participant AC as AdminController
    participant AUD as AuditService
    participant DB as Data Base

    Note over ADMIN, DB: interaction : system-wide activity tracking

    ADMIN->>FE: 1 : filters logs by User or Date
    FE->>AC: 2 : getLogs(getLogsRequest)
    AC->>AUD: 3 : getLogs(userId, actionType, startDate, endDate)
    AUD->>DB: 4 : select from action_logs ...
    DB-->>AUD: 5 : List<ActionLog>
    AUD-->>AC: 6 : List<ActionLogDto>
    AC-->>FE: 7 : 200 OK
    FE-->>ADMIN: 8 : Display audit table with user activities
```

## 🔄 Sequence 3: Admin Command Center (Analytics)

```mermaid
sequenceDiagram
    title: Admin Command Center (Regional Analytics)
    autonumber
    participant ADMIN as ADMINISTRATOR
    participant FE as FRONT END
    participant AC as AdminController
    participant ANS as AnalyticsService
    participant DB as Data Base

    Note over ADMIN, DB: interaction : regional and subject-based BI

    ADMIN->>FE: 1 : filters by Region/Delegation/Subject
    FE->>AC: 2 : getAdminAnalytics(getAdminAnalyticsRequest)
    AC->>ANS: 3 : getAdminAnalytics(subject, regionId, delegationId)
    
    par parallel aggregation
        ANS->>DB: 4 : countUsersInJurisdiction()
        ANS->>DB: 5 : countActivitiesInRegion()
        ANS->>DB: 6 : calculateRegionalAvgScore()
    end

    ANS-->>AC: 7 : AdminAnalyticsDto
    AC-->>FE: 8 : 200 OK
    FE-->>ADMIN: 9 : Render High-level Regional Dashboard
```

## 📋 Key Operations

| Operation | Component | Description |
| :--- | :--- | :--- |
| **Registry** | `AdminService` | **Read-Only** overview of all platform users to monitor registration volume and profile completeness. |
| **Auditing** | `AuditService` | Provides a historical timeline of all critical system actions (logins, report finalizations, quiz submissions). |
| **Regional BI** | `AnalyticsService` | Aggregates data at the Region and Delegation levels, allowing Admins to compare pedagogical performance across the country. |
| **Security** | `PreAuthorize` | Strictly enforces `hasRole('ADMIN')` at the Controller level for all operations. |
