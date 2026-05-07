# AI Quiz Management Sequence Diagram

This diagram documents the advanced pedagogical evaluation flow, where AI (Gemini) is used to generate questions and evaluate teacher submissions.

## 🔄 Sequence 1: AI-Powered Quiz Creation (Inspector)

```mermaid
sequenceDiagram
    title: AI-Powered Quiz Creation
    autonumber
    participant USER as INSPECTOR
    participant FE as FRONT END
    participant IQC as InspectorQuizController
    participant QS as QuizService
    participant GS as GeminiService
    participant NS as NotificationService
    participant DB as Data Base

    Note over USER, DB: interaction : AI question generation and publishing

    USER->>FE: 1 : type(subject,topic)
    FE->>IQC: 2 : generateAIQuestions(generateAIQuestionsRequest)
    IQC->>QS: 3 : generateAIQuestions(topic, subject)
    QS->>GS: 4 : generateQuizContent(topic, subject)
    GS-->>QS: 5 : AI-Generated JSON (Questions)
    QS-->>IQC: 6 : List<Map<String, Object>>
    IQC-->>FE: 7 : display generated questions
    
    USER->>FE: 8 : review and click "Publish"
    FE->>IQC: 9 : saveQuiz(saveQuizRequest)
    IQC->>QS: 10 : saveQuiz(userId, title, questions, ...)
    QS->>DB: 11 : Save(Quiz & QuizQuestions)
    
    loop notify matching teachers
        QS->>NS: 12 : sendNotification(teacherId, "New Quiz Assigned", ...)
        NS->>DB: 13 : Save(Notification)
    end

    QS-->>IQC: 14 : QuizResponse
    IQC-->>FE: 15 : 200 OK (Published)
```

## 🔄 Sequence 2: Quiz Submission & AI Evaluation (Teacher)

```mermaid
sequenceDiagram
    title: AI Quiz Submission Evaluation
    autonumber
    participant USER as TEACHER
    participant FE as FRONT END
    participant TQC as TeacherQuizController
    participant QS as QuizService
    participant GS as GeminiService
    participant NS as NotificationService
    participant DB as Data Base

    USER->>FE: 1 : selects quiz & answers questions
    FE->>TQC: 2 : submitQuiz(quizId, answers)
    TQC->>QS: 3 : submitQuiz(teacherId, quizId, answers)
    QS->>DB: 4 : findById(quizId)
    
    rect rgb(240, 240, 255)
        Note right of QS: 5 : Prepare Evaluation Context<br/>(Questions + Correct Answers + User Answers)
    end

    QS->>GS: 6 : evaluateSubmission(context, userAnswers)
    GS-->>QS: 7 : AI Evaluation (Score, Text, Suggestions)
    
    QS->>DB: 8 : Save(QuizSubmission)
    
    Note over QS, NS: Notify Inspector of performance
    QS->>NS: 9 : sendNotification(inspectorId, "Quiz Submitted", score, ...)
    NS->>DB: 10 : Save(Notification)

    QS-->>TQC: 11 : AI Evaluation Result
    TQC-->>FE: 12 : 200 OK
    FE-->>USER: 13 : Display Score & AI Feedback
```

## 📋 Key Operations

| Operation | Component | AI Role |
| :--- | :--- | :--- |
| **Generation** | `GeminiService` | Generates contextually relevant pedagogical questions based on the selected Subject and Topic. |
| **Publishing** | `NotificationService` | Automatically alerts all teachers who share the same Subject as the newly created quiz. |
| **Evaluation** | `GeminiService` | Analyzes answers (including open text) to provide a score, critical feedback, and training suggestions. |
| **Submission** | `QuizRepository` | Prevents double submission (Conflict 409) to ensure evaluation integrity. |
