# Chapter 4: Implementation (Sprint 3)

## 4.3 Sprint 3: AI Training & Evaluation

### 4.3.1 Sprint Objective
The objective of this sprint is to integrate Artificial Intelligence (Google Gemini) into the platform to automate the creation of pedagogical training materials and provide teachers with real-time, personalized evaluation feedback.

### 4.3.2 Sprint Backlog
| ID | Feature | ID US | User Story | Priority |
| :--- | :--- | :--- | :--- | :--- |
| F7 | AI Quiz Generation | US7.1 | As an Inspector, I want to generate subject-specific quizzes using AI. | High |
| F8 | Quiz Submission | US8.1 | As a Teacher, I want to take a quiz and submit my answers for evaluation. | High |
| F9 | Automated Eval | US9.1 | As a Teacher, I want to receive instant AI feedback on my quiz performance. | High |

### 4.3.3 Analysis of the Sprint
This sprint represents the **Intelligence Layer** of the platform. We integrated the **Google Generative AI (Gemini)** API to solve the problem of content creation. The system uses "Contextual Prompting" where the Inspector provides a topic (e.g., "Active Learning in Physics") and the system instructs the AI to generate a valid JSON structure containing multiple-choice questions, correct answers, and pedagogical rationales.

### 4.3.4 Descriptive Table of Use Case: Generate AI-Driven Quiz
| Element | Description |
| :--- | :--- |
| **Use Case** | **Generate AI-Driven Pedagogical Quiz** |
| **Actors** | Inspector |
| **Pre-conditions** | Inspector must specify a topic and a pedagogical subject. |
| **Post-conditions** | A new Quiz entity is persisted with AI-generated questions. |
| **Nominal Scenario** | 1. Inspector enters topic and subject.<br>2. System sends structured prompt to Gemini AI.<br>3. System parses the AI JSON response.<br>4. System displays questions for Inspector review.<br>5. Inspector saves the quiz to the platform. |
| **Exceptions** | - **AI Service Timeout**: If the API is unavailable, an error is logged.<br>- **Parsing Error**: If the AI returns malformed JSON, the system retries. |

### 4.3.5 Description of Sequence Diagrams
The **AI Evaluation Sequence** documents the flow from submission to feedback. When a teacher submits answers, the `QuizService` sends the user's answers and the correct context back to the AI engine, which generates a qualitative evaluation of the teacher's pedagogical understanding, providing much more value than a simple numeric score.

### 4.3.6 Backlog Conclusion
By the end of Sprint 3, the platform has evolved from a management tool into an intelligent training partner. The automation of content generation significantly reduces the workload for inspectors while providing teachers with immediate, data-driven professional development opportunities.
