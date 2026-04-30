# Inspector-Teacher Management Sequence Diagram

This diagram documents the pedagogical supervision flow, where an Inspector manages their assigned teachers and analyzes their professional performance through various insights.

## 🔄 Sequence 1: Retrieve Assigned Teachers

```mermaid
sequenceDiagram
    title: Assigned Teachers Retrieval
    autonumber
    participant USER as INSPECTOR
    participant FE as FRONT END
    participant IPC as InspectorProfileController
    participant IPS as InspectorProfileService
    participant TPR as TeacherProfileRepository
    participant DB as Data Base

    Note over USER, DB: interaction : viewing assigned teaching staff

    USER->>FE: 1 : navigates to "My Teachers" page
    FE->>IPC: 2 : Get-api-inspector-profile-my-teachers
    IPC->>IPS: 3 : getMyTeachers(inspectorId)
    IPS->>DB: 4 : findByUserId(inspectorId)
    
    rect rgb(240, 240, 255)
        Note right of IPS: 5 : Filter teachers based on Inspector's jurisdiction<br/>(Delegation/Dependency matches)
    end
    
    IPS->>TPR: 6 : findByJurisdiction(...)
    TPR->>DB: 7 : select * from teacher_profiles ...
    DB-->>TPR: 8 : List<TeacherProfile>
    TPR-->>IPS: 9 : List<TeacherProfile>
    IPS-->>IPC: 10 : List<TeacherDto>
    IPC-->>FE: 11 : 200 OK
    FE-->>USER: 12 : display teacher grid cards
```

## 🔄 Sequence 2: Teacher Insights (Pedagogical Drill-down)

```mermaid
sequenceDiagram
    title: Teacher Insights Drill-down
    autonumber
    participant USER as INSPECTOR
    participant FE as FRONT END
    participant IPC as InspectorProfileController
    participant IPS as InspectorProfileService
    participant DB as Data Base

    USER->>FE: 1 : clicks "View Insights" on a teacher card
    FE->>USER: 2 : open TeacherInsightsModal
    
    par parallel data fetching
        FE->>IPC: 3 : Get-api-inspector-profile-teachers-{id}-timetable
        IPC->>IPS: 4 : getTeacherTimetable(inspectorId, teacherId)
        IPS->>DB: 5 : select * from timetables ...
        DB-->>FE: 6 : Timetable Data
    and
        FE->>IPC: 7 : Get-api-inspector-profile-teachers-{id}-reports
        IPC->>IPS: 8 : getTeacherReports(inspectorId, teacherId)
        IPS->>DB: 9 : select * from activity_reports ...
        DB-->>FE: 10 : Reports History
    and
        FE->>IPC: 11 : Get-api-inspector-profile-teachers-{id}-quizzes
        IPC->>IPS: 12 : getTeacherQuizzes(inspectorId, teacherId)
        IPS->>DB: 13 : select * from quiz_submissions ...
        DB-->>FE: 14 : Quiz Results
    end

    FE-->>USER: 15 : display consolidated pedagogical dashboard
```

## 📋 Key Operations

| Operation | Component | Description |
| :--- | :--- | :--- |
| **Filtering** | `InspectorProfileService` | Uses a complex cross-reference logic to identify teachers working in the same Delegations/Schools as the Inspector. |
| **Insights** | `TeacherInsightsModal` | Uses parallel API calls to populate the modal with Timetables, Reports, and Quiz data simultaneously for zero-latency feel. |
| **Security** | **Jurisdiction Check** | The backend verifies that the requested `teacherId` actually falls under the Inspector's supervision before returning data. |
