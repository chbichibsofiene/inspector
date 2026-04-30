# Chapter 4: Implementation (Sprint 2)

## 4.2 Sprint 2: Pedagogical Supervision

### 4.2.1 Sprint Objective
The objective of this sprint is to implement the core pedagogical supervision cycle, allowing Inspectors to plan activities (visits/formations), conduct them (including online via Jitsi), and document the results in formal evaluation reports.

### 4.2.2 Sprint Backlog
| ID | Feature | ID US | User Story | Priority |
| :--- | :--- | :--- | :--- | :--- |
| F4 | Activity Management | US4.1 | As an Inspector, I want to create, update, and cancel pedagogical activities. | High |
| F5 | Online Integration | US5.1 | As an Inspector, I want to host online pedagogical sessions via Jitsi Meet. | Medium |
| F6 | Evaluation Reports | US6.1 | As an Inspector, I want to draft and finalize evaluation reports for teachers. | High |
| F6 | Evaluation Reports | US6.2 | As a Teacher, I want to download my finalized reports as PDF documents. | Medium |

### 4.2.3 Analysis of the Sprint
This sprint handles the **Execution Layer**. The pedagogical workflow is divided into two phases: **Planning** and **Documentation**. The system uses a state machine for reports; a report starts as a `DRAFT` (visible only to the inspector) and transitions to `FINAL` (locked and visible to the teacher). Finalization triggers an automatic email notification to the evaluated teacher.

### 4.2.4 Descriptive Table of Use Case: Finalize Evaluation Report
| Element | Description |
| :--- | :--- |
| **Use Case** | **Finalize Pedagogical Report** |
| **Actors** | Inspector |
| **Pre-conditions** | An activity must have been completed; a draft report must exist. |
| **Post-conditions** | Report status is set to `FINAL`; Teacher is notified via email. |
| **Nominal Scenario** | 1. Inspector opens the draft report.<br>2. Inspector enters scores and observations.<br>3. Inspector clicks "Finalize".<br>4. System locks the report and sends email notification.<br>5. System updates teacher performance insights. |
| **Exceptions** | - **Validation Error**: Score out of range (Rejected).<br>- **Already Final**: Report cannot be edited after finalization. |

### 4.2.5 Description of Sequence Diagrams
The **Report Management Sequence** illustrates the transition from a completed activity to a professional record. It details how the `ReportService` interacts with the `NotificationService` to bridge the communication gap between the supervisor and the practitioner upon report locking.

### 4.2.6 Backlog Conclusion
Sprint 2 successfully digitizes the traditional inspection cycle. By implementing the transition from activities to formal reports, the platform ensures that pedagogical feedback is documented, archived, and instantly accessible to teachers.
