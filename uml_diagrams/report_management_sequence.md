# Report Management Sequence Diagram (Full CRUD)

This diagram documents the complete lifecycle of a pedagogical report, including secure updates, finalization notifications, and deletion logic.

## 🔄 Sequence 1: Report Creation Flow

```mermaid
sequenceDiagram
    title: Report Creation Flow
    autonumber
    participant USER as INSPECTOR
    participant FE as FRONT END
    participant RC as ReportController
    participant RS as ReportService
    participant NS as NotificationService
    participant DB as Data Base

    Note over USER, DB: interaction : report creation and finalization

    USER->>FE: 1 : enter observations & recommendations
    FE->>RC: 2 : Post-api-inspector-reports
    RC->>RS: 3 : createReport(inspectorId, request)
    RS->>DB: 4 : findById(activityId) & verify owner
    
    RS->>DB: 5 : Save(ActivityReport)
    
    opt status == FINAL
        RS->>NS: 6 : sendNotification(teacherId, "New Report Available", ...)
        NS->>DB: 7 : Save(Notification)
    end

    RS-->>RC: 8 : ReportResponse
    RC-->>FE: 9 : 201 Created
    FE-->>USER: 10 : display report card
```

## 🔄 Sequence 2: Report Update Flow

```mermaid
sequenceDiagram
    title: Report Update Flow
    autonumber
    participant USER as INSPECTOR
    participant FE as FRONT END
    participant RC as ReportController
    participant RS as ReportService
    participant NS as NotificationService
    participant DB as Data Base

    USER->>FE: 1 : modify observations or change status
    FE->>RC: 2 : Put-api-inspector-reports-{id}
    RC->>RS: 3 : updateReport(inspectorId, reportId, request)
    RS->>DB: 4 : findById(reportId)
    
    rect rgb(255, 240, 240)
        Note right of RS: 5 : verify owner (inspectorId)
    end

    RS->>DB: 6 : Save(Updated Report)
    
    opt status changed to FINAL
        RS->>NS: 7 : sendNotification(teacherId, "New Report Available", ...)
        NS->>DB: 8 : Save(Notification)
    end

    RS-->>RC: 9 : ReportResponse
    RC-->>FE: 10 : 200 OK
    FE-->>USER: 11 : refresh report view
```

## 🔄 Sequence 3: Report Deletion Flow

```mermaid
sequenceDiagram
    title: Report Deletion Flow
    autonumber
    participant USER as INSPECTOR
    participant FE as FRONT END
    participant RC as ReportController
    participant RS as ReportService
    participant DB as Data Base

    USER->>FE: 1 : click delete report
    FE->>RC: 2 : Delete-api-inspector-reports-{id}
    RC->>RS: 3 : deleteReport(inspectorId, reportId)
    RS->>DB: 4 : findById(reportId) & verify owner
    
    RS->>DB: 5 : Delete(Report)
    DB-->>RS: 6 : void
    RS-->>RC: 7 : void
    RC-->>FE: 8 : 200 OK
    FE-->>USER: 9 : remove from list
```

## 🔄 Sequence 4: PDF Operations

```mermaid
sequenceDiagram
    title: PDF Export Flow
    autonumber
    participant USER as INSPECTOR
    participant FE as FRONT END
    participant RC as ReportController
    participant PS as PdfExportService
    participant DB as Data Base

    USER->>FE: 1 : click "Download PDF"
    FE->>RC: 2 : Get-api-inspector-reports-{id}-pdf
    RC->>PS: 3 : exportReport(inspectorId, reportId, ...)
    PS->>DB: 4 : findById(reportId)
    PS-->>RC: 5 : byte[] (PDF Content)
    RC-->>FE: 6 : File Transfer (application/pdf)
    FE-->>USER: 7 : triggers browser download
```

## 📋 Key Operations

| Operation | Component | Security/Logic |
| :--- | :--- | :--- |
| **Update** | `ReportService` | Dynamically triggers a teacher notification only when the status is transitioned to **FINAL**. |
| **Security** | **Ownership Check** | Prevents an inspector from modifying or deleting reports belonging to another inspector. |
| **Export** | `PdfExportService` | Generates a read-only document based on the current database state of the report. |
