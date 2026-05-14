# Chapter 4: Implementation (Sprint 1)

## 4.1 Sprint 1: Identity & Security

### 4.1.1 Sprint Objective
The objective of this sprint is to establish a secure, role-based access control system that validates user registration against the national personnel database and allows users to complete their specialized professional profiles.

### 4.1.2 Sprint Backlog
| ID | Feature | ID US | User Story | Priority |
| :--- | :--- | :--- | :--- | :--- |
| F1 | Authentication | US1.1 | As a user, I want to login securely using my email and password. | High |
| F2 | Registration | US2.1 | As a professional, I want to register using my Serial Code and CIN. | High |
| F3 | Profile Setup | US3.1 | As an Inspector/Teacher, I want to complete my professional profile details (Subject, Rank, Phone). | High |

### 4.1.3 Analysis of the Sprint
This sprint focuses on the **Onboarding Experience**. The system must ensure that only verified Ministry personnel can access the platform. Once authenticated, the user must undergo a "Profile Setup" phase where specialized data (which is not in the general Personnel table) is captured, such as their specific pedagogical subject or regional jurisdiction.

### 4.1.4 Descriptive Table of Use Case: Authentication & Registration
| Element | Description |
| :--- | :--- |
| **Use Case** | **Register & Authenticate** |
| **Actors** | Inspector, Teacher |
| **Pre-conditions** | User must possess valid Ministry credentials (Serial Code/CIN). |
| **Post-conditions** | User receives a JWT token; account is enabled. |
| **Nominal Scenario** | 1. User submits registration form.<br>2. System validates Serial Code/CIN against Personnel database.<br>3. System persists User entity.<br>4. System issues JWT for subsequent requests. |
| **Exceptions** | - **Validation Failure**: User is not found in Personnel table (Rejected). |

### 4.1.5 Descriptive Table of Use Case: Profile Setup
| Element | Description |
| :--- | :--- |
| **Use Case** | **Complete Professional Profile** |
| **Actors** | Inspector, Teacher |
| **Pre-conditions** | User must be logged in and have an active account. |
| **Post-conditions** | `profileCompleted` flag is set to TRUE; Profile entity is persisted. |
| **Nominal Scenario** | 1. User navigates to Profile Setup.<br>2. User enters Subject, Language, and Phone.<br>3. System creates `InspectorProfile` or `TeacherProfile` linked to User.<br>4. System updates User status. |
| **Exceptions** | - **Data Incomplete**: Mandatory fields missing (Rejected). |

### 4.1.6 Description of Sequence Diagrams
The **Auth Sequence** documents the validation logic against the Personnel master records. The **Profile Sequence** shows the polymorphic storage logic, where data is routed to different tables based on the user's role determined during registration.

### 4.1.7 Backlog Conclusion
Sprint 1 successfully provides the platform's security foundation. By the end of this phase, the system can distinguish between actors and has captured all necessary metadata required for pedagogical supervision.
