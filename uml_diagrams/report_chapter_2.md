# Chapter 2: Analysis & Requirements

## 2.1 Actor Identification
The platform involves several actors, each with specific roles and privileges:
*   **Inspector**: The primary user who manages the pedagogical quality. They plan activities, conduct evaluations, generate AI content, and monitor teacher professional growth.
*   **Teacher**: The professional being evaluated and trained. they access their schedule, view reports, take AI-driven quizzes, and participate in professional courses.
*   **Administrator**: Focuses on platform oversight. They monitor the user registry, review system audit logs, and analyze high-level regional data via the BI command center.
*   **AI Gemini (System Actor)**: An intelligent subsystem that generates pedagogical content and provides automated evaluations.

## 2.2 Functional Requirements
The system's functionalities are categorized into six core modules:

### 2.2.1 Identity & Security
*   **Registration**: Users must register using a unique Serial Code and CIN, validated against the national personnel database.
*   **Authentication**: Secure login using JWT (JSON Web Tokens) with role-based access control (RBAC).
*   **Profile Management**: Specialized profile setup for Inspectors (subject, rank, jurisdiction) and Teachers (subject, establishment).

### 2.2.2 Pedagogical Supervision
*   **Activity Planning**: Creating, updating, and deleting pedagogical sessions (Visits, Formations, Meetings).
*   **Online Interaction**: Integration with Jitsi Meet for virtual pedagogical sessions.
*   **Report Management**: Drafting and finalizing professional reports with automated scoring and recommendations.

### 2.2.3 AI Training & Evaluation
*   **Quiz Generation**: Using Gemini AI to create dynamic, subject-specific multiple-choice questions.
*   **Automated Evaluation**: Instant scoring of teacher submissions with AI-generated pedagogical feedback.

### 2.2.4 Professional Learning
*   **Course Management**: Creation of modular training courses by inspectors.
*   **Progress Tracking**: Teachers can track their completion status for each lesson and module.

### 2.2.5 Communication & Messaging
*   **Real-time Messenger**: Secure professional chat between inspectors and teachers.
*   **Notification Engine**: Automated alerts for new reports, planned activities, or assigned courses.

### 2.2.6 Administrative Governance
*   **BI Dashboard**: Visualization of regional KPIs (Total Users, Activity Volume, Average Performance Scores).
*   **Audit Logging**: Historical tracking of all critical system actions for accountability.

## 2.3 Non-Functional Requirements
To ensure a professional and reliable experience, the system must adhere to:
1.  **Security**: All data transmission must be secured, and sensitive operations (Admin actions) must be strictly protected.
2.  **Performance**: Analytics aggregation must be efficient (parallel fetching) to ensure the dashboard remains responsive even with large datasets.
3.  **Usability**: The interface must be responsive (mobile-friendly) and provide a premium "Command Center" aesthetic.
4.  **Reliability**: The system must provide data integrity, ensuring that reports and quiz scores are never lost or corrupted.
5.  **Scalability**: The architecture must support an increasing number of regions and delegations without degradation in performance.
