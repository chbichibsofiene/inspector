# Backend Implementation: Sprint-by-Sprint Workflows (A to Z)

This document provides a comprehensive breakdown of the Inspector Platform backend architecture, organized by development sprints. It details every scenario, the methods involved, and how files communicate across layers.

---

## 🏗️ Architecture Overview
The backend follows a **layered architecture**:
1.  **Controller Layer**: Handles HTTP requests, validates input (DTOs), and returns responses.
2.  **Service Layer**: Contains business logic, cross-service communication, and transaction management.
3.  **Repository Layer**: Communicates with the MySQL database using Spring Data JPA.
4.  **Security Layer**: Intercepts requests using JWT filters to ensure authorized access.

---

## 🚀 Sprint 1: Identity & Security
**Objective:** Establish a verified onboarding system and secure role-based access control.

### 📋 Scenarios & Method Chain
| Scenario | Controller Method | Service Method | Communication / Repository |
| :--- | :--- | :--- | :--- |
| **Registration** | `AuthController.register()` | `AuthService.register()` | Checks `personnelRepository` for valid Ministry credentials. |
| **Login** | `AuthController.login()` | `AuthService.login()` | Communicates with `authenticationManager` and `JwtUtil`. |
| **Inspector Setup** | `InspectorProfileController.completeProfile()` | `InspectorProfileService.completeProfile()` | Links `User` to `InspectorProfile`; sets `profileCompleted = true`. |
| **Teacher Setup** | `TeacherProfileController.completeProfile()` | `TeacherProfileService.completeProfile()` | Links `User` to `TeacherProfile` and one `Etablissement`. |
| **Password Reset** | `AuthController.forgotPassword()` | `AuthService.forgotPassword()` | Calls `EmailService` to send a 6-digit code. |

### 🔍 Key Workflow: Registration Handshake
When a user registers, the `AuthServiceImpl.java` performs a critical verification:
```java
// Line 64 of AuthServiceImpl.java
var personnel = personnelRepository.findBySerialCode(request.getSerialCode())
        .filter(p -> p.getCin().equals(request.getCin()))
        .orElseThrow(() -> new PersonnelNotFoundException("Registration rejected: Unauthorized personnel."));
```
This ensures that only official Ministry staff (found in the read-only `Personnel` table) can create an account.

---

## 📅 Sprint 2: Activity & Jurisdiction
**Objective:** Enable Inspectors to manage their assigned territory and schedule visits/meetings.

### 📋 Scenarios & Method Chain
| Scenario | Controller Method | Service Method | Communication / Repository |
| :--- | :--- | :--- | :--- |
| **Schedule Visit** | `ActivityController.createActivity()` | `ActivityService.createActivity()` | Saves to `activityRepository`; validates Inspector's subject vs Teacher. |
| **Get My Teachers** | `InspectorProfileController.getMyTeachers()` | `InspectorProfileService.getMyTeachers()` | Filtered by `DelegationId` and `Subject` matching the Inspector's profile. |
| **View Calendar** | `ActivityController.getMyActivities()` | `ActivityService.getActivitiesForUser()` | Fetches events from `activityRepository` filtered by current `userId`. |

### 🔍 Key Workflow: Jurisdiction Filtering
Inspectors only see teachers within their jurisdiction. This communication happens via the `InspectorProfileService`:
```java
List<TeacherProfile> teachers = teacherProfileRepository.findByDelegationIdInAndSubject(
        inspector.getDelegations().stream().map(d -> d.getId()).toList(),
        inspector.getSubject()
);
```

---

## 📝 Sprint 3: Pedagogical Monitoring & Reports
**Objective:** Digitalize the evaluation process and enable real-time communication between actors.

### 📋 Scenarios & Method Chain
| Scenario | Controller Method | Service Method | Communication / Repository |
| :--- | :--- | :--- | :--- |
| **Create Report** | `ReportController.createReport()` | `ReportService.createReport()` | Persists `ActivityReport`; links to an `Activity` ID. |
| **Finalize Report** | `ReportController.updateStatus()` | `ReportService.finalizeReport()` | Changes status to `FINAL`; triggers `NotificationService`. |
| **Export to PDF** | `ReportController.downloadPdf()` | `PdfExportService.generateReportPdf()` | Streams a generated PDF using `iText` library. |
| **Live Chat** | `MessengerController.sendMessage()` | `MessengerService.saveMessage()` | Communicates via `WebSocket` (SimpMessagingTemplate). |

### 🔍 Key Workflow: The Report-Notification Loop
When a report is finalized:
1.  `ReportServiceImpl` updates the database.
2.  It calls `NotificationService.sendNotification()`.
3.  `NotificationService` saves to DB and broadcasts via `WebSocket` to the Teacher's mobile app.

---

## 🤖 Sprint 4: AI Quizzes & Analytics
**Objective:** Leverage AI for teacher training and provide data-driven insights.

### 📋 Scenarios & Method Chain
| Scenario | Controller Method | Service Method | Communication / Repository |
| :--- | :--- | :--- | :--- |
| **AI Quiz Generation**| `InspectorQuizController.generate()` | `QuizService.generateAiQuiz()` | Calls `AiProviderService` (API) -> Parses JSON -> `quizRepository.save()`. |
| **Submit Quiz** | `TeacherQuizController.submit()` | `QuizService.submitResponse()` | Calculates score; saves to `quizSubmissionRepository`. |
| **Global Analytics** | `AnalyticsController.getStats()` | `AnalyticsService.calculate()` | Aggregates data from `Reports`, `Quizzes`, and `Activities`. |

### 🔍 Key Workflow: AI Integration
The `QuizServiceImpl` communicates with the AI module to transform a subject string into a structured JSON quiz:
```java
String prompt = "Generate a 10-question quiz for " + subject;
String aiResponse = aiService.generate(prompt);
Quiz quiz = jsonMapper.readValue(aiResponse, Quiz.class);
quizRepository.save(quiz);
```

---

## 🔔 Sprint 5: Notifications & Administration
**Objective:** Manage global system state, user verification, and real-time alerts.

### 📋 Scenarios & Method Chain
| Scenario | Controller Method | Service Method | Communication / Repository |
| :--- | :--- | :--- | :--- |
| **System Alerts** | `NotificationController.getMine()` | `NotificationService.getForUser()` | Fetches unread notifications from `notificationRepository`. |
| **Admin User Mgt** | `AdminController.toggleUser()` | `AdminService.toggleEnabled()` | Updates `User.enabled` status; sends email to user. |
| **Audit Logging** | `AdminController.getLogs()` | `LogService.findAll()` | Reads from `action_logs` table (Created by `LogService.log()`). |

---

## 🔄 Final Communication Map (The "A to Z" Flow)

**User Action** → **Controller** → **Service** → **Repository** → **Database**

1.  **Request Handshake**: `ApiResponse<T>` is the standard envelope for all communications.
2.  **Security Gate**: `JwtAuthenticationFilter` validates the "Passport" (token) for every single call.
3.  **Data Movement**: `DTOs` (Data Transfer Objects) are used to move data between the frontend and backend to keep the database models hidden.
4.  **Logging**: `LogService` records every major action (Login, Create Report, Delete Activity) for auditing.
