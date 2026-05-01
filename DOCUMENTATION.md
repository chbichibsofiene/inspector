# Inspector Platform - Full Documentation

## 1. Project Overview
The **Inspector Platform** is a comprehensive web-based solution designed to streamline the workspace of educational inspectors in Tunisia. It facilitates communication, activity planning, report generation, and data analytics between inspectors, teachers, and pedagogical administrators.

### Core Objectives:
- Centralize inspector activities and professional scheduling.
- Automate the generation and management of pedagogical evaluation reports.
- Provide real-time notifications and reminders for upcoming activities.
- Integrate with **Jitsi Meet** for secure virtual sessions.
- Offer data-driven insights through an embedded analytics dashboard.

---

## 2. System Architecture
The platform follows a modern decoupled architecture:
- **Frontend**: Single Page Application (SPA) built with **React 18** and **Vite**, styled with modern Vanilla CSS.
- **Backend**: **Spring Boot 3.x** REST API following a multi-tier architecture (Controller → Service → Repository → Entity).
- **Database**: **MySQL** for persistent storage.
- **Security**: Stateless authentication using **JWT (JSON Web Tokens)** and role-based access control (RBAC).
- **Email**: JavaMailSender with HTML email templates for automated notifications.

---

## 3. Technology Stack

### Backend:
- **Framework**: Spring Boot 3.2.3
- **Language**: Java 17
- **Security**: Spring Security + JWT
- **Data Access**: Spring Data JPA / Hibernate
- **Database**: MySQL 8.x
- **Email**: Spring Mail (SMTP)
- **PDF Generation**: Native raw PDF builder (`PdfExportServiceImpl`) with word-wrap support
- **Build Tool**: Maven 3.9.x

### Frontend:
- **Library**: React 18
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (Modern Glassmorphism / Gradient Design)
- **API Client**: Axios
- **Icons**: Lucide React
- **Calendar**: Custom weekly/monthly/daily view

---

## 4. Key Features & User Roles

### User Roles:
1. **ADMIN**: Manages user accounts, validates registrations, and assigns roles.
2. **INSPECTOR**: Plans activities, assigns teachers, generates evaluation reports, exports PDFs, and joins virtual sessions.
3. **TEACHER**: Views assigned activities on a synchronized calendar, accesses finalized evaluation reports (with observations, recommendations, and score), and downloads PDF copies.

### Main Modules:

| Module | Description |
| :--- | :--- |
| **Authentication** | JWT-based login, registration with email verification workflow, and forgot-password with OTP codes. |
| **Activity Planner** | Interactive weekly/monthly calendar for scheduling inspections, trainings, and meetings (in-person or online). |
| **Report System** | Draft/Final report lifecycle with score, observations, and recommendations. Supports PDF export (with text wrapping) and scanned PDF import. |
| **Teacher Report View** | Teachers can view report cards and click **"View Details"** to open a modal showing full observations, recommendations, and score. |
| **Notification System** | Real-time in-app alerts and automated HTML email notifications for new assignments and report finalization. |
| **Jitsi Integration** | Auto-generated Jitsi Meet URLs for virtual activities, accessible directly from the activity details. |
| **Admin Dashboard** | User management, account verification, and role assignment panel. |

---

## 5. Directory Structure

### Backend (`/backend`)
```
src/main/java/com/inspector/platform/
├── controller/        REST endpoints (Auth, Activity, Report, Teacher, Admin...)
├── service/           Business logic interfaces and implementations
│   └── impl/          PdfExportServiceImpl, EmailServiceImpl, ActivityServiceImpl...
├── repository/        Spring Data JPA repositories
├── entity/            JPA entities (User, Activity, ActivityReport, InspectorProfile, TeacherProfile...)
├── dto/               Data Transfer Objects for API requests/responses
└── security/          JWT filter, SecurityConfig, UserDetailsService
```

### Frontend (`/inspector-frontend`)
```
src/
├── api/               Axios instances and service functions (auth, reports, activities...)
├── components/        Reusable UI components (Modals, Navbars, TeacherInsightsModal...)
├── pages/             Main views
│   ├── InspectorCalendar.jsx     Weekly/monthly activity calendar
│   ├── InspectorReports.jsx      Report creation, editing, PDF export/import
│   ├── TeacherReports.jsx        Teacher report cards with "View Details" modal
│   ├── AdminAnalytics.jsx        Admin dashboard
│   └── ...
├── context/           React context for Auth and Notifications
└── assets/            Images and global styles
```

---

## 6. PDF Export — Technical Notes

The PDF export is built from scratch using raw PDF specification (no external library). Key implementation details in `PdfExportServiceImpl`:

- **Text wrapping**: Long fields (Observations, Recommendations) are broken at word boundaries using the `wrapText()` method (max 90 characters per line) to prevent overflow beyond page margins.
- **State guard**: If a report has an `importedPdf` attached, it is returned directly instead of generating a new one.
- **Score visibility**: Teachers see `"Confidential"` for the score field on their exported PDF.

---

## 7. Installation & Setup

### Prerequisites:
- JDK 17+
- Node.js 18+
- MySQL Server 8.x

### Database Setup:
1. Create a database named `inspector_system_db`.
2. Configure credentials in `backend/src/main/resources/application.properties`.

### Running the Backend:
```bash
cd backend
# Using bundled Maven:
apache-maven-3.9.6/bin/mvn.cmd spring-boot:run

# Or if Maven is on PATH:
mvn spring-boot:run
```
Backend runs on: `http://localhost:8081`

### Running the Frontend:
```bash
cd inspector-frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## 8. API Reference

| Endpoint | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/api/auth/login` | POST | Authenticate user and return JWT | Public |
| `/api/auth/register` | POST | Register a new account | Public |
| `/api/auth/forgot-password` | POST | Request OTP password reset | Public |
| `/api/admin/users` | GET | List all users for validation | ADMIN |
| `/api/activities` | GET/POST | Manage inspector activities | INSPECTOR |
| `/api/activities/{id}` | PUT/DELETE | Update or cancel an activity | INSPECTOR |
| `/api/reports` | POST | Create a pedagogical report | INSPECTOR |
| `/api/reports/{id}` | PUT | Update a draft report | INSPECTOR |
| `/api/reports/{id}/export-pdf` | GET | Export report as PDF | INSPECTOR/TEACHER |
| `/api/reports/{id}/import-pdf` | POST | Import scanned PDF for a report | INSPECTOR |
| `/api/teacher/reports` | GET | Get all reports for authenticated teacher | TEACHER |
| `/api/teacher/activities` | GET | Get all activities for authenticated teacher | TEACHER |

---

## 9. Business Rules

- **Activity Scheduling**: Activities must be scheduled between **08:00 and 17:00**, Monday to Saturday.
- **Report Locking**: Once a report's status is set to `FINAL`, its content is locked and cannot be edited.
- **Score Confidentiality**: The score is hidden from the teacher's PDF export (shown as "Confidential").
- **PDF Import Priority**: If a report has an imported PDF, it takes precedence over the auto-generated one on download.
- **Email Notifications**: Sent automatically on report finalization and new activity assignment.

---

## 10. Deployment Notes
- Ensure `app.jwt.secret` is updated to a secure random string in production.
- Configure SMTP credentials in `application.properties` for email functionality.
- The platform uses `cors.allowed-origins` to restrict access to specific frontend domains.
- Replace `http://localhost:5173` action URLs in email templates with the production domain.

---

## 11. Test Accounts (Development)

| Role | Email | Password |
| :--- | :--- | :--- |
| Inspector | `slimen.bouthour@inspector.tn` | `Password123!` |
| Teacher | `sofien.chbichib@teacher.tn` | `Password123!` |

---

## 12. Contributors
- Developed as a **PFE (Projet de Fin d'Études)**.
- Repository: `https://github.com/chbichibsofiene/inspector`

---

## 13. License
This project is licensed under the MIT License.
