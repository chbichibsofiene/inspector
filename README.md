# 🎓 Inspector Platform

> A comprehensive digital ecosystem for educational inspectors, teachers, and administrators.

[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.x-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/Database-MySQL%208-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 Quick Start

### 1. Prerequisites
- **Java 17** or higher
- **Node.js 18** or higher
- **MySQL 8** (Optional: can run with H2 in local mode)

### 2. Backend Setup
```bash
cd backend
# For MySQL mode (Configure application.properties first)
./mvnw spring-boot:run

# For Local Demo mode (In-memory H2 database)
./mvnw spring-boot:run "-Dspring-boot.run.profiles=local"
```

### 3. Frontend Setup
```bash
cd inspector-frontend
npm install
npm run dev
```

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

