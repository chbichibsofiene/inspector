# Inspector Platform

This project is a PFE web platform for the educational inspector workspace. It is built with a Spring Boot REST API, a MySQL database, and a React/Vite frontend.

## Current Scope

- User registration and authentication with JWT.
- Administrative validation of new accounts.
- Role-based access for `ADMIN`, `INSPECTOR`, `TEACHER`, and `PEDAGOGICAL_RESPONSIBLE`.
- Dashboards for each role.
- Admin user management: list users, validate pending users, and change roles.
- Inspector activity management: create, edit, move, delete, and list activities from the inspector frontend, backed by REST endpoints.
- Calendar planning page with month, week, and day views.
- Activity report management: create, edit, delete, list, import PDF attachments, and download PDF reports linked to inspector activities and teachers.
- Power BI analytics integration page with a secured dataset endpoint for inspector indicators.
- Inspector teacher selection endpoint for activity planning.
- Teacher and inspector profile data models.
- UML files for use case and class diagrams:
  - `CU_GLOBAL (6).mdj`
  - `digramme de class.mdj`

## Functional Workflow

1. A user creates an account from the frontend registration page with email, password, and serial code.
2. The backend stores the account as not verified.
3. The admin logs in and opens the admin workspace.
4. The admin validates pending accounts and can adjust each user's role.
5. Once verified, the user logs in again.
6. The frontend stores the JWT token and redirects the user by role:
   - `ADMIN` goes to `/admin`
   - `INSPECTOR` goes to `/inspector`
   - `TEACHER` goes to `/teacher`
   - `PEDAGOGICAL_RESPONSIBLE` goes to `/responsible`
7. Protected routes check the saved user role before showing a page.
8. API requests send the JWT token in the `Authorization: Bearer <token>` header.
9. The backend security filter validates the token and authorizes access to protected endpoints.
10. Role dashboards return the relevant data for the connected user.
11. An inspector can open the activity planner, select teachers, create an inspection or training activity, and delete planned activities.
12. After an activity, the inspector can open the reports page, write observations, recommendations, score the activity, save the report as draft or final, import an existing PDF, and download the PDF.
13. The inspector can open the Power BI page to view KPIs and connect a Power BI report to the analytics endpoint.

## Technical Workflow

The frontend talks to the backend through REST endpoints under `http://localhost:8081`.

Main backend layers:

- `controller`: receives HTTP requests and returns API responses.
- `service`: contains business logic.
- `repository`: communicates with the database using Spring Data JPA.
- `entity`: defines the database models.
- `dto`: defines request and response payloads.
- `security`: handles JWT generation, validation, and authentication.

Main frontend layers:

- `src/api`: Axios API clients.
- `src/auth`: local session storage and protected route handling.
- `src/pages`: login, registration, admin, inspector, teacher, and responsible pages.
- `src/App.jsx`: application routes.

## Run The Backend

Requirements:

- Java 17
- MySQL running locally for the default profile
- Database user configured in `backend/src/main/resources/application.properties`

From `backend`:

```powershell
cmd /c apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
```

The backend starts on:

```text
http://localhost:8081
```

The database URL is currently:

```text
jdbc:mysql://localhost:3306/inspector_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
```

For local demo login without MySQL credentials, run the `local` profile:

```powershell
cmd /c apache-maven-3.9.6\bin\mvn.cmd spring-boot:run -Dspring-boot.run.profiles=local
```

Demo accounts:

```text
admin@test.com / password123
inspector@test.com / password123
teacher.one@test.com / password123
teacher.two@test.com / password123
responsible@test.com / password123
```

Power BI integration:

```text
Frontend page: /inspector/powerbi
Dataset API: http://localhost:8081/api/inspector/analytics/powerbi
Optional embed env variable: VITE_POWER_BI_REPORT_URL
```

## Run The Frontend

From `inspector-frontend`:

```powershell
npm.cmd install
npm.cmd run dev
```

The frontend starts on the Vite URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Verification

These checks passed on April 10, 2026:

```powershell
cmd /c apache-maven-3.9.6\bin\mvn.cmd test
npm.cmd run lint
npm.cmd run build
```

Notes:

- The local Maven folder was restored from `backend/maven.zip` because the extracted folder was missing the Maven boot JAR.
- Frontend dependencies were installed with `npm.cmd install`.
- `npm audit` reports 5 dependency vulnerabilities: 1 moderate, 3 high, and 1 critical. Review them before production deployment.

## PFE Explanation Summary

The platform centralizes inspector work. First, users request access. Then an administrator validates accounts and assigns roles. After login, every role sees only its own workspace. The inspector can manage professional activities, the teacher can consult teacher-related information, the pedagogical responsible can monitor teachers and inspectors, and the admin supervises users and platform access.

The system follows a multi-tier architecture:

```text
React frontend -> Spring Boot REST API -> Spring Data JPA -> MySQL database
```

This separation makes the project easier to maintain: the frontend focuses on user interaction, the backend controls security and business logic, and the database stores the platform data.

## Remaining Ideas

These features are described in the PFE terms of reference and can be added after the current base:

- Word export for reports.
- Teacher evaluation forms with criteria and scores.
- Charts and KPIs for inspections, training, and teacher performance.
- Prediction models for inspector workload and teacher support needs.
