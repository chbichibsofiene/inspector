# Inspector Platform - Detailed Use Case Diagram

This diagram provides a granular view of the system's functionalities, detailing the specific CRUD operations and professional workflows for each actor.

```mermaid
graph LR
    %% Actors
    I((Inspector))
    T((Teacher))
    A((Administrator))
    AI((AI Gemini))

    subgraph Authentication
        UC_Reg(Register with Serial Code/CIN)
        UC_Log(Login)
        UC_Pass(Reset Forgotten Password)
    end

    subgraph Activity_Management
        UC_A_Create(Create Pedagogical Activity)
        UC_A_Update(Update Activity Details)
        UC_A_Delete(Cancel/Delete Activity)
        UC_A_View(View Scheduled Activities)
    end

    subgraph Report_Management
        UC_R_Create(Draft Evaluation Report)
        UC_R_Final(Finalize & Notify Teacher)
        UC_R_PDF(Export Report to PDF)
        UC_R_History(View Professional History)
    end

    subgraph AI_Quiz_System
        UC_Q_Gen(Generate AI Questions)
        UC_Q_Pub(Publish Quiz to Subject)
        UC_Q_Sub(Submit Quiz Answers)
        UC_Q_Eval(Automated AI Evaluation)
    end

    subgraph Course_Learning
        UC_C_Manage(Create & Structure Course)
        UC_C_Assign(Assign Course to Teachers)
        UC_C_Learn(Take Lessons & Quizzes)
        UC_C_Track(Monitor Learning Progress)
    end

    subgraph Admin_Governance
        UC_G_Registry(Monitor User Registry)
        UC_G_Logs(Audit Action Logs)
        UC_G_BI(Analyze Regional Analytics)
    end

    %% Inspector Relationships
    I --> UC_Reg
    I --> UC_Log
    I --> UC_Pass
    I --> UC_A_Create
    I --> UC_A_Update
    I --> UC_A_Delete
    I --> UC_A_View
    I --> UC_R_Create
    I --> UC_R_Final
    I --> UC_R_History
    I --> UC_Q_Gen
    I --> UC_Q_Pub
    I --> UC_C_Manage
    I --> UC_C_Assign

    %% Teacher Relationships
    T --> UC_Reg
    T --> UC_Log
    T --> UC_A_View
    T --> UC_R_PDF
    T --> UC_R_History
    T --> UC_Q_Sub
    T --> UC_C_Learn
    T --> UC_C_Track

    %% Administrator Relationships
    A --> UC_Log
    A --> UC_G_Registry
    A --> UC_G_Logs
    A --> UC_G_BI

    %% AI System Relationships
    AI -.->|Generates| UC_Q_Gen
    AI -.->|Analyzes| UC_Q_Eval
    UC_Q_Sub -.->|triggers| UC_Q_Eval
```

## 📋 Use Case Breakdown (CRUD & Business Logic)

| Module | Use Case | Actor | CRUD/Logic Description |
| :--- | :--- | :--- | :--- |
| **Activities** | Create/Update/Delete | Inspector | Managing the pedagogical calendar and meeting types (Online/Physical). |
| **Reports** | Finalize & Notify | Inspector | Locking a report and triggering an automatic notification to the teacher. |
| **Reports** | Export PDF | Teacher/Inspector | Generating a formatted professional document for administrative records. |
| **AI Quiz** | Generate | Inspector | Using Gemini to create subject-specific questions dynamically. |
| **AI Quiz** | Automated Eval | AI System | Real-time analysis of submissions with pedagogical feedback. |
| **Courses** | Structure/Assign | Inspector | Building modular professional development content for their district. |
| **Governance** | Audit Logs | Administrator | Reviewing the timeline of all critical system actions for security. |
| **Governance** | Regional BI | Administrator | High-level data visualization of pedagogical impact across delegations. |
