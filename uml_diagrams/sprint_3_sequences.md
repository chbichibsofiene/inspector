# Sprint 3 Sequence Diagrams: Course Management & AI Evaluation

## 5.3 Design

### 5.3.1 Sequence Diagrams

This section presents the main operational flows of the Pedagogical Training and AI Evaluation module through sequence diagrams. These diagrams provide a clear visualization of interactions between the frontend, backend services, AI engines, and notification mechanisms, helping to understand how complex pedagogical training workflows are executed step by step. They also guide the development process by ensuring that the AI integration and content management logic remain consistent with the defined business requirements.

**Main Actors and Roles:**
This sprint involves five main actors who collaborate to ensure the proper execution of the intelligent training cycle:
*   **Inspector**: The primary content orchestrator, responsible for building modular courses, uploading lessons, and using AI tools to generate contextual evaluation quizzes for their teachers.
*   **Teacher**: The primary beneficiary of the training module, who interacts with the platform to follow assigned courses, track their learning progress, and complete AI-driven quizzes.
*   **Gemini AI Service**: An intelligent system actor that provides the generative capabilities required to create structured quiz questions and perform deep qualitative analysis of teacher performance.
*   **Database (MySQL)**: The core persistence layer, responsible for storing the hierarchical curriculum data, AI-generated content, and fine-grained teacher progression logs.
*   **Notification/Email System**: A supporting component that facilitates engagement by alerting teachers of new professional development opportunities and notifying inspectors of completed evaluations.

Through this module, the platform transforms from an administrative tool into a smart training partner, providing Inspectors with AI-assisted content creation and giving Teachers a structured, data-driven path for professional growth.

## 1. Course Creation & Assignment Sequence
Illustrates the process by which an Inspector constructs a modular course and assigns it to specific teachers.

```mermaid
sequenceDiagram
    actor INS as Inspector
    participant FE as React Frontend
    participant CC as CourseController
    participant CS as CourseService
    participant DB as MySQL Database
    participant NT as NotificationService

    INS->>FE: Define (Course, Modules , Lessons)
    FE->>CC: createCourse(createCourseRequest)
    CC->>CS: createFullCourse(dto)
    
    CS->>DB: Save Course Entity
    CS->>DB: Save CourseModules
    CS->>DB: Save CourseLessons
    CS-->>CC: Course Created
    
    INS->>FE: Select(teacherIds)
    FE->>CC: assignCourse(assignCourseRequest)
    CC->>CS: assignCourse(courseId, teacherIds)
    
    CS->>DB: Create CourseAssignment records
    CS->>NT: sendNotification(QUIZ_ASSIGNED)
    NT-->>DB: Persist Notification
    
    CS-->>CC: Assignment Successful
    CC-->>FE: HTTP 200 (Success)
    FE-->>INS: Display Confirmation
```

## 2. Quiz assessment Flow Sequence
Details the intelligent evaluation process when a teacher submits an assessment, including the synchronous call to the Gemini AI engine.

```mermaid
sequenceDiagram
    actor TCH as Teacher
    participant FE as React Frontend
    participant QC as QuizController
    participant QS as QuizService
    participant AI as Gemini AI Service
    participant DB as MySQL Database
    participant NT as NotificationService
    actor INS as Inspector

    TCH->>FE: Submit Quiz Answers
    FE->>QC: POST /api/quizzes/{id}/submit
    QC->>QS: submitQuiz(teacherId, quizId, answers)
    
    QS->>QS: Calculate Numeric Score (MCQ)
    QS->>AI: evaluateSubmission(quizContext, answers)
    Note over QS,AI: Synchronous call to Gemini API
    AI-->>QS: Return JSON (Evaluation + Suggestions)
    
    QS->>DB: Save QuizSubmission (Score, AI Feedback)
    QS->>NT: notifyInspector(QUIZ_SUBMITTED)
    NT-->>DB: Persist Notification for Inspector
    
    QS-->>QC: Submission Result
    QC-->>FE: HTTP 200 (Recorded)
    FE-->>TCH: Show "Submitted Successfully"
    
    Note over INS,DB: Inspector later views evaluation
    INS->>FE: Open Quiz Results
    FE->>QC: GET /api/quizzes/submissions/{id}
    QC->>QS: getSubmissionDetails(id)
    QS->>DB: Fetch Submission & AI Feedback
    QS-->>FE: Return Detailed Evaluation
    FE-->>INS: Display Score & AI Insights
```

## 3. Lesson Progress Tracking Sequence
Details how the system records a teacher's completion of specific course materials.

```mermaid
sequenceDiagram
    actor TCH as Teacher
    participant FE as React Frontend
    participant LC as CourseController
    participant LS as CourseService
    participant DB as MySQL Database

    TCH->>FE: Click "Mark as Completed"
    FE->>LC: POST /api/courses/lessons/{id}/progress
    LC->>LS: updateLessonProgress(teacherId, lessonId, completed=true)
    
    LS->>DB: findProgress(teacherId, lessonId)
    alt Progress exists
        LS->>DB: update(LessonProgress, completedAt=NOW)
    else First time
        LS->>DB: save(new LessonProgress)
    end
    
    LS-->>LC: Progress Updated
    LC-->>FE: HTTP 200 (OK)
    FE-->>TCH: Update Progress Bar (UI)
```

## 4. Activity Diagram: AI Quiz Generation Lifecycle
Visualizes the human-in-the-loop process where AI generates content and the Inspector validates/edits it.

```mermaid
stateDiagram-v2
    [*] --> InputTopic: Inspector provides topic
    InputTopic --> GeminiRequest: System constructs prompt
    GeminiRequest --> AIResponse: External call to Gemini API
    AIResponse --> Parsing: System parses JSON response
    
    Parsing --> Error: Malformed JSON
    Error --> GeminiRequest: Retry
    
    Parsing --> ReviewInterface: Display questions to Inspector
    state ReviewInterface {
        [*] --> Reviewing
        Reviewing --> Editing: Manual refinement
        Editing --> Reviewing
        Reviewing --> Validated: Click "Publish"
    }
    
    Validated --> Database: Persist Quiz & Questions
    Database --> Notification: Alert assigned teachers
    Notification --> [*]
```

## 5. Component Diagram: Sprint 3 Architecture
Illustrates the physical and logical components involved in the Training & AI Evaluation module.

```mermaid
graph LR
    subgraph "Frontend Layer (React)"
        CBuilder[Course Builder]
        TDash[Teacher Dashboard]
        QInterface[Quiz Interface]
    end

    subgraph "Service Layer (Spring Boot)"
        CServ[CourseService]
        QServ[QuizService]
        AServ[AIService/Gemini]
        NServ[NotificationService]
    end

    subgraph "Persistence & External"
        MySQL[(MySQL DB)]
        GemAPI{Google Gemini API}
        SMTP[SMTP Server]
    end

    CBuilder --> CServ
    TDash --> CServ
    QInterface --> QServ
    
    CServ --> MySQL
    QServ --> MySQL
    QServ --> AServ
    AServ --> GemAPI
    CServ --> NServ
    QServ --> NServ
    NServ --> SMTP
```

## 6. AI Quiz Generation Flow Sequence
Illustrates the interaction between the platform and the Google Gemini API to generate pedagogical assessments based on a specific topic.

```mermaid
sequenceDiagram
    actor INS as Inspector
    participant FE as React Frontend
    participant QC as QuizController
    participant QS as QuizService
    participant AI as Gemini AI Service
    participant GAP as Google Gemini API

    INS->>FE: Enters Topic & Subject
    FE->>QC: POST /api/quizzes/generate-questions
    QC->>QS: generateAIQuestions(topic, subject)
    
    QS->>AI: generateQuizContent(topic, subject)
    AI->>GAP: POST /v1beta/models/gemini... (JSON Prompt)
    GAP-->>AI: Return Raw JSON Response
    
    AI-->>QS: Return Structured JSON String
    
    QS->>QS: Parse JSON to List of Questions
    Note over QS: Validates Schema & MCQ Structure
    
    QS-->>QC: List of Generated Questions
    QC-->>FE: HTTP 200 (JSON Data)
    FE-->>INS: Display Questions for Review/Edit
```

## 5.4 Implementation

### 5.4.1 Interfaces description
The implementation of Sprint 3 focuses on providing a fluid, modern experience for both content creators and learners. The following interfaces were designed to facilitate the complex pedagogical training workflow:

*   **Course Builder Interface (Inspector)**: A structured management workspace where inspectors can create hierarchical courses, define modules, and upload various lesson materials (PDFs, Videos, and Links). It ensures that the curriculum is logically organized for the teachers.
*   **Teacher Learning Dashboard**: A personalized space for teachers to view their assigned courses. It includes a real-time progress tracker (percentage bar) and allows teachers to navigate through modules and mark lessons as completed to satisfy their professional development requirements.
*   **AI Quiz Generation Module**: An interactive tool where inspectors provide a pedagogical topic and subject. The system displays a loading state while communicating with the Gemini API and presents the generated questions in a review interface for final validation before publication.
*   **Inspector Review Dashboard (Quiz assessment)**: A specialized analytics view where inspectors can browse teacher quiz submissions. It displays the numeric score and provides a detailed drill-down into the qualitative AI evaluation and personalized training suggestions for each teacher.
