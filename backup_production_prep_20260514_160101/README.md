# 🎓 Inspector Platform

> A comprehensive digital ecosystem for educational inspectors, teachers, and administrators.

[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.x-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/Database-MySQL%208-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 Quick Start (How to Run)

### 1. 🐳 The Docker Way (One-Click)
Ensure you have Docker Desktop running, then:
```bash
docker-compose up -d --build
```
- **Web App**: `http://localhost:8082`
- **Backend API**: `http://localhost:8081`

---

### 2. 🛠 The Manual Way (Development)

#### **Step 1: Database (XAMPP)**
Start **MySQL** and create a database named `inspector_system_db`.

#### **Step 2: Backend (Spring Boot)**
```powershell
cd backend
.\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
```

#### **Step 3: Frontend Web (React)**
```powershell
cd inspector-frontend
npm install && npm run dev
```

#### **Step 4: Mobile (Expo)**
```powershell
cd mobile-frontend
npm install && npx expo start
```

| Service | URL |
| :--- | :--- |
| Frontend (web) | `http://localhost:5173` |
| Backend API | `http://localhost:8081` |
| Frontend (Docker) | `http://localhost:8082` |

---

## 📖 Documentation
For a deep dive into the architecture, features, and setup, please refer to the:
👉 **[Full Project Documentation](DOCUMENTATION.md)**

---

## ✨ Key Features
- **Smart Scheduling**: Interactive calendar for activity planning.
- **Automated Reporting**: One-click PDF generation for pedagogical reports.
- **Real-time Notifications**: Never miss an inspection with automated reminders.
- **Teams Integration**: Join virtual meetings directly from the dashboard.
- **KPI Analytics**: Visualize performance with Power BI integration.

---

## 🔐 Role-Based Access
| Role | Responsibility |
| :--- | :--- |
| **Admin** | User validation & system management |
| **Inspector** | Activity planning & teacher evaluation |
| **Teacher** | Accessing reports & personal timetable |
| **Responsible** | Regional oversight & performance tracking |

---

## 🛠 Tech Stack
- **Backend**: Spring Boot, Spring Security, JWT, JPA/Hibernate.
- **Frontend**: React, Vite, Axios, Tailwind CSS.
- **Database**: MySQL (Production), H2 (Development).
- **Integrations**: Microsoft Graph API (Teams), Power BI.

---

## 📧 Support
For support or inquiries, please contact the development team or open an issue in this repository.

---
*Developed as part of the PFE (Project de Fin d'Études) - 2026.*

