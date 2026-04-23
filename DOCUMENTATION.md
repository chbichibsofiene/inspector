# Inspector Platform - Full Documentation

## 1. Project Overview
The **Inspector Platform** is a comprehensive web-based solution designed to streamline the workspace of educational inspectors. It facilitates communication, activity planning, report generation, and data analytics between inspectors, teachers, and pedagogical administrators.

### Core Objectives:
- Centralize inspector activities and scheduling.
- Automate the generation and management of pedagogical reports.
- Provide real-time notifications and reminders for upcoming activities.
- Integrate with Microsoft Teams for virtual meetings.
- Offer data-driven insights through Power BI integration.

---

## 2. System Architecture
The platform follows a modern decoupled architecture:
- **Frontend**: Single Page Application (SPA) built with **React** and **Vite**, styled with modern CSS/Tailwind.
- **Backend**: **Spring Boot** REST API following a multi-tier architecture (Controller, Service, Repository, Entity).
- **Database**: **MySQL** for persistent storage, with H2 support for local development.
- **Security**: Stateless authentication using **JWT (JSON Web Tokens)** and role-based access control (RBAC).

---

## 3. Technology Stack

### Backend:
- **Framework**: Spring Boot 3.x
- **Language**: Java 17
- **Security**: Spring Security + JWT
- **Data Access**: Spring Data JPA / Hibernate
- **Database**: MySQL 8.x
- **Build Tool**: Maven

### Frontend:
- **Library**: React 18
- **Build Tool**: Vite
- **Styling**: Vanilla CSS / Tailwind (Modern Glassmorphism Design)
- **API Client**: Axios
- **Icons**: Lucide React / FontAwesome

---

## 4. Key Features & User Roles

### User Roles:
1.  **ADMIN**: Manages user accounts, validates registrations, and assigns roles.
2.  **INSPECTOR**: Plans activities, selects teachers, generates reports, and views analytics.
3.  **TEACHER**: Views assigned activities, accesses pedagogical reports, and manages personal timetables.
4.  **PEDAGOGICAL RESPONSIBLE**: Oversees regional activities and teacher performance.

### Main Modules:
- **Authentication**: JWT-based login, registration with serial codes, and account verification workflow.
- **Activity Planner**: Interactive calendar for scheduling inspections, trainings, and meetings.
- **Report System**: Automated PDF generation from activity data, draft/final status management, and file attachments.
- **Notification System**: Real-time alerts for new assignments and reminders 2 hours before scheduled activities.
- **Microsoft Teams Integration**: OAuth2-based connection to create and join virtual meetings directly from the platform.
- **Power BI Dashboard**: Embedded analytics for tracking KPIs and performance metrics.

---

## 5. Directory Structure

### Backend (`/backend`)
- `src/main/java/com/inspector/platform/`:
    - `controller/`: REST endpoints.
    - `service/`: Business logic interfaces and implementations.
    - `repository/`: Database interaction (Spring Data JPA).
    - `entity/`: JPA entities (User, Activity, Report, etc.).
    - `dto/`: Data Transfer Objects for API requests/responses.
    - `security/`: JWT and Security configuration.
- `src/main/resources/`:
    - `application.properties`: Main configuration (MySQL).
    - `application-local.properties`: Local development profile (H2).

### Frontend (`/inspector-frontend`)
- `src/api/`: Axios instances and API service functions.
- `src/components/`: Reusable UI components (Modals, Navbars, Buttons).
- `src/pages/`: Main application views (Login, Dashboards, Planner).
- `src/context/`: React context for state management (Auth, Notifications).
- `src/assets/`: Images and global styles.

---

## 6. Installation & Setup

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
./mvnw spring-boot:run
```

### Running the Frontend:
```bash
cd inspector-frontend
npm install
npm run dev
```

---

## 7. API Reference (Partial)

| Endpoint | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/api/auth/login` | POST | Authenticate user and return JWT | Public |
| `/api/auth/register` | POST | Register a new account | Public |
| `/api/admin/users` | GET | List all users for validation | ADMIN |
| `/api/activities` | GET/POST | Manage inspector activities | INSPECTOR |
| `/api/reports` | POST | Generate a pedagogical report | INSPECTOR |

---

## 8. Deployment Notes
- Ensure the `app.jwt.secret` is updated to a secure string in production.
- Configure Microsoft Azure Client ID and Secret for Teams integration.
- The platform uses `cors.allowed-origins` to restrict access to specific frontend domains.

---

## 9. Contributors
- Developed as a PFE (Project de Fin d'Études).
- Lead Developer: [Your Name/Team]

---

## 10. License
This project is licensed under the MIT License - see the LICENSE file for details.
