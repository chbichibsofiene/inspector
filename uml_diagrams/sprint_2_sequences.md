# Sprint 2 Sequence Diagrams: Pedagogical Supervision

This document contains the detailed UML sequence diagrams for the workflows implemented in Sprint 2.

## 1. Activity Creation & Planning
This diagram shows the process of scheduling a pedagogical session, including time validation and automated notifications.

```mermaid
sequenceDiagram
    title: Activity Creation Flow
    autonumber
    participant INS as INSPECTOR
    participant FE as FRONT END
    participant AC as ActivityController
    participant AS as ActivityServiceImpl
    participant DB as Data Base
    participant NS as NotificationService
    participant MAIL as Email System

    Note over INS, MAIL: interaction : schedule pedagogical session

    INS->>FE: Inputs Title, Date, Time, Guests
    FE->>AC: POST /api/activities
    AC->>AS: createActivity(inspectorId, request)
    
    AS->>AS: validateTimeConstraints(8 AM - 5 PM, Not Sunday)
    
    alt Validation Fails
        AS-->>AC: ResponseStatusException (400)
        AC-->>FE: Error Message
        FE-->>INS: "Invalid Scheduling Hours"
    end

    AS->>DB: save(Activity Entity)
    DB-->>AS: savedActivity

    loop For each Assigned Teacher
        AS->>NS: sendNotification(INVITE_GUEST)
        NS->>DB: save(Notification)
        NS-->>MAIL: Dispatch Invitation Email
    end

    AS-->>AC: ActivityResponse
    AC-->>FE: 201 Created
    FE-->>INS: Display in Calendar
```

## 2. Report Drafting & Update
This flow covers the iterative process of an inspector writing a pedagogical report.

```mermaid
sequenceDiagram
    title: Report Drafting Flow
    autonumber
    participant INS as INSPECTOR
    participant FE as FRONT END
    participant RC as ReportController
    participant RS as ReportServiceImpl
    participant DB as Data Base

    Note over INS, DB: interaction : draft pedagogical report

    INS->>FE: Enters Scores and Observations
    FE->>RC: updateReport(updateReportRequest)
    RC->>RS: updateReport(id, request)
    
    RS->>DB: findById(id)
    DB-->>RS: ActivityReport Entity

    rect rgb(240, 240, 240)
        Note right of RS: Check: Current status must not be FINAL
    end

    RS->>DB: save(Updated Report)
    DB-->>RS: savedReport

    RS-->>RC: ReportResponse
    RC-->>FE: 200 OK
    FE-->>INS: "Draft Saved Successfully"
```

## 3. Report Finalization & Locking
This is the critical workflow that locks the report and notifies the teacher.

```mermaid
sequenceDiagram
    title: Report Finalization Flow
    autonumber
    participant INS as INSPECTOR
    participant FE as FRONT END
    participant RC as ReportController
    participant RS as ReportServiceImpl
    participant DB as Data Base
    participant MAIL as Email System

    Note over INS, MAIL: interaction : finalize and lock report

    INS->>FE: Clicks "Finalize Report"
    FE->>RC: updateReport(updateReportRequest)
    RC->>RS: updateReport(id, request)
    
    RS->>DB: findById(id)
    DB-->>RS: ActivityReport Entity

    RS->>DB: setStatus(FINAL) & setLocked(true)
    DB-->>RS: savedReport

    RS->>MAIL: sendReportFinalizedEmail(teacher, reportDetails)
    MAIL-->>INS: Log: "Professional alert dispatched"

    RS-->>RC: ReportResponse
    RC-->>FE: 200 OK
    FE-->>INS: Interface toggles to Read-Only
```

## 4. Consult & Download PDF (Teacher)
This flow shows how a teacher accesses their finalized professional record.

```mermaid
sequenceDiagram
    title: Consult & Download PDF Flow
    autonumber
    participant TCH as TEACHER
    participant FE as FRONT END
    participant RC as ReportController
    participant RS as ReportServiceImpl
    participant PS as PdfExportServiceImpl
    participant DB as Data Base

    Note over TCH, DB: interaction : retrieve evaluation record

    TCH->>FE: Clicks "Download PDF"
    FE->>RC: downloadReportPdf(downloadReportPdfRequest)
    RC->>RS: downloadReportPdf(id)
    
    RS->>DB: findById(id)
    DB-->>RS: ActivityReport Entity

    alt Report is not FINAL
        RS-->>RC: 403 Forbidden
        RC-->>FE: Error Message
    end

    RS->>PS: generatePdf(reportData)
    PS-->>RS: byte[] (PDF Document)

    RS-->>RC: ResponseEntity<byte[]>
    RC-->>FE: HTTP 200 (application/pdf)
    FE-->>TCH: Browser opens/downloads PDF
```

## 5. Join Online Session (Jitsi)
This diagram illustrates the integration with the virtual classroom infrastructure.

```mermaid
sequenceDiagram
    title: Join Online Session Flow
    autonumber
    participant ACTOR as INSPECTOR/TEACHER
    participant FE as FRONT END
    participant OMS as OnlineMeetingService
    participant JS as Jitsi External Server

    Note over ACTOR, JS:    OnlineSession: virtual pedagogical session

    ACTOR->>FE: Clicks "Join Online Session"
    FE->>OMS: getMeetingLink(activityId)
    OMS-->>FE: Secure Jitsi URL

    FE->>JS: Open Room Window
    JS->>ACTOR: Connect Camera/Microphone
    JS-->>ACTOR: Virtual Room Interface
```
