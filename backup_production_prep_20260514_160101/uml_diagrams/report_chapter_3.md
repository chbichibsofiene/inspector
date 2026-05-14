# Chapter 3: Design & Architecture

## 3.1 Technology Stack
To ensure a robust, scalable, and modern platform, we selected the following technologies:
*   **Frontend**: Developed with **React.js** for a dynamic user experience, using **Vanilla CSS** for premium "Command Center" aesthetics and **Mermaid.js** for integrated diagram rendering.
*   **Backend**: Built on **Spring Boot 3.2.3**, leveraging the Java ecosystem for its stability, enterprise-grade security (Spring Security), and seamless data management (Spring Data JPA).
*   **Database**: **MySQL** was chosen as the relational database management system to ensure ACID compliance and handle complex jurisdictional relationships.
*   **Artificial Intelligence**: Integrated with **Google Gemini AI** via the REST API to power dynamic quiz generation and intelligent pedagogical feedback.
*   **Authentication**: Implemented using **JSON Web Tokens (JWT)** for secure, stateless communication between the frontend and backend.

## 3.2 System Architecture
The platform follows a **Layered Architecture** pattern to ensure a clean separation of concerns:
1.  **Presentation Layer (Frontend)**: Handles the user interface, state management, and API consumption.
2.  **Controller Layer**: Exposes RESTful endpoints and handles incoming HTTP requests and security authorization.
3.  **Service Layer**: The core of the platform where business logic is implemented (e.g., automated report scoring, AI quiz logic).
4.  **Repository Layer**: Interacts with the database using JPA/Hibernate for persistent data storage.

## 3.3 Structural Design: Class Diagram
The **Class Diagram** (see `class_diagram.md`) serves as the blueprint for the system's data model. Key design decisions include:
*   **Polymorphic Profiles**: Using a core `User` entity linked to specialized `InspectorProfile` and `TeacherProfile` classes.
*   **Organizational Hierarchy**: A strict mapping of `Region` -> `Delegation` -> `Etablissement` to enforce data jurisdiction.
*   **Pedagogical Link**: The relationship between `Activity`, `ActivityReport`, and the evaluation system.

## 3.4 Behavioral Design: Sequence Diagrams
We modeled the platform's dynamic behavior through several sequence diagrams (see `uml_diagrams/` folder):
*   **Authentication Flow**: Illustrates the login and registration process, including personnel validation.
*   **Report Finalization**: Shows the interaction between the Inspector, the backend service, and the notification engine when a report is locked.
*   **Admin Analytics**: Documents how the command center aggregates data in parallel across multiple jurisdictional levels to generate BI insights.

## 3.5 Database Design
The relational schema was designed to optimize pedagogical tracking:
*   **Integrity Constraints**: Foreign keys ensure that every activity is linked to a valid inspector and that reports are always associated with a teacher.
*   **Source of Truth**: The `Personnel` table acts as the authoritative source for all account provisioning, preventing unauthorized registrations.
*   **Indexing**: Strategic indexing on `serialCode` and `email` ensures fast lookup during authentication and data aggregation.
