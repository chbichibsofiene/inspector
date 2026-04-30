# Diagrammes UML pour le Rapport de PFE : Inspector Platform

Ce document regroupe les différents diagrammes UML nécessaires pour la conception de votre plateforme "Inspector Platform". Ils sont générés en utilisant la syntaxe Mermaid, que vous pouvez copier/coller dans des outils comme draw.io, ou visualiser directement sur GitHub ou Notion.

## 1. Diagramme de Cas d'Utilisation (Use Case Diagram)
Ce diagramme montre les interactions entre les différents acteurs (Inspecteur, Enseignant) et le système.

```mermaid
usecaseDiagram
    actor Inspecteur as "Inspecteur"
    actor Enseignant as "Enseignant"
    
    package "Inspector Platform" {
        usecase "S'authentifier (Email ou Microsoft)" as UC1
        usecase "Compléter son profil" as UC2
        
        usecase "Planifier une activité" as UC3
        usecase "Créer/Gérer un Quiz" as UC4
        usecase "Rédiger un rapport pédagogique" as UC5
        usecase "Gérer l'emploi du temps" as UC6
        usecase "Consulter le tableau de bord" as UC7
        
        usecase "Passer un Quiz" as UC8
        usecase "Consulter l'emploi du temps" as UC9
        usecase "Télécharger un rapport pédagogique" as UC10
        usecase "Consulter les notifications" as UC11
    }
    
    Inspecteur --> UC1
    Inspecteur --> UC2
    Inspecteur --> UC3
    Inspecteur --> UC4
    Inspecteur --> UC5
    Inspecteur --> UC6
    Inspecteur --> UC7
    Inspecteur --> UC11
    
    Enseignant --> UC1
    Enseignant --> UC2
    Enseignant --> UC8
    Enseignant --> UC9
    Enseignant --> UC10
    Enseignant --> UC11
    Enseignant --> UC7
    
    UC3 ..> UC1 : <<include>>
    UC4 ..> UC1 : <<include>>
    UC5 ..> UC1 : <<include>>
```

---

## 2. Diagramme de Classes (Class Diagram)
Ce diagramme illustre le modèle de données de l'application, les entités principales et leurs relations.

```mermaid
classDiagram
    class User {
        +Long id
        +String email
        +String password
        +String serialCode
        +Role role
        +boolean enabled
        +boolean profileCompleted
        +LocalDateTime createdAt
        +boolean isMicrosoftConnected
        +String profileImageUrl
        +onCreate()
    }

    class Personnel {
        +Long id
        +String cin
        +String firstName
        +String lastName
        +LocalDate recruitmentDate
        +String serialCode
        +Role role
    }

    class InspectorProfile {
        +Long id
        +String firstName
        +String lastName
        +InspectorRank rank
        +Subject subject
        +SchoolLevel schoolLevel
        +String phone
        +String language
        +List~Delegation~ delegations
        +List~Dependency~ dependencies
        +List~Department~ departments
        +List~Etablissement~ etablissements
    }

    class TeacherProfile {
        +Long id
        +String firstName
        +String lastName
        +Subject subject
        +String phone
        +String language
        +Delegation delegation
        +Dependency dependency
        +Etablissement etablissement
    }

    class Activity {
        +Long id
        +String title
        +String description
        +LocalDateTime startDateTime
        +LocalDateTime endDateTime
        +ActivityType type
        +String location
        +List~TeacherProfile~ guests
        +boolean isOnline
        +String meetingUrl
        +boolean isReminderSent
    }

    class ActivityReport {
        +Long id
        +String title
        +String observations
        +String recommendations
        +Integer score
        +byte[] importedPdf
        +ReportStatus status
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
        +onCreate()
        +onUpdate()
    }

    class Quiz {
        +Long id
        +String title
        +Subject subject
        +String topic
        +List~QuizQuestion~ questions
        +LocalDateTime createdAt
        +onCreate()
    }

    class QuizQuestion {
        +Long id
        +String questionText
        +QuestionType type
        +String options
        +String correctAnswer
    }

    class QuizSubmission {
        +Long id
        +String answers
        +Integer score
        +String evaluationText
        +String trainingSuggestion
        +LocalDateTime submittedAt
        +onSubmit()
    }

    class Course {
        +Long id
        +String title
        +String description
        +Subject subject
        +CourseStatus status
        +List~CourseModule~ modules
        +List~CourseAssignment~ assignments
        +LocalDateTime createdAt
        +onCreate()
        +onUpdate()
    }

    class CourseModule {
        +Long id
        +String title
        +String description
        +Integer orderIndex
        +List~CourseLesson~ lessons
    }

    class CourseLesson {
        +Long id
        +String title
        +LessonType type
        +String contentUrl
        +String description
        +Integer durationMinutes
        +Integer orderIndex
    }

    class CourseAssignment {
        +Long id
        +LocalDateTime assignedAt
        +onCreate()
    }

    class Delegation {
        +Long id
        +String name
    }

    class Department {
        +Long id
        +String name
        +Delegation delegation
    }

    class Dependency {
        +Long id
        +String name
        +Delegation delegation
    }

    class Etablissement {
        +Long id
        +String name
        +SchoolLevel schoolLevel
        +Dependency dependency
    }

    class Notification {
        +Long id
        +String message
        +boolean isRead
        +LocalDateTime createdAt
    }

    class TimetableSlot {
        +Long id
        +DayOfWeek dayOfWeek
        +LocalTime startTime
        +LocalTime endTime
        +Subject subject
        +String classroom
        +String level
    }

    class Conversation {
        +Long id
        +LocalDateTime lastMessageTime
        +onCreate()
    }

    class Message {
        +Long id
        +String content
        +LocalDateTime timestamp
        +boolean isRead
        +String fileUrl
        +String fileName
        +String fileType
        +onCreate()
    }

    User "1" -- "1" InspectorProfile : profile
    User "1" -- "1" TeacherProfile : profile
    InspectorProfile "1" -- "*" Activity : organizes
    Activity "1" -- "*" TeacherProfile : guests
    Activity "1" -- "0..1" ActivityReport : report
    InspectorProfile "1" -- "*" Quiz : creates
    Quiz "1" -- "*" QuizQuestion : questions
    TeacherProfile "1" -- "*" QuizSubmission : submissions
    Quiz "1" -- "*" QuizSubmission : submissions
    InspectorProfile "1" -- "*" Course : manages
    Course "1" -- "*" CourseModule : modules
    CourseModule "1" -- "*" CourseLesson : lessons
    TeacherProfile "*" -- "*" Course : assigned
    User "1" -- "*" Notification : notifications
    TeacherProfile "1" -- "*" TimetableSlot : timetable
    User "1" -- "*" Conversation : participates
    Conversation "1" -- "*" Message : messages
    Delegation "1" -- "*" Department : contains
    Delegation "1" -- "*" Dependency : contains
    Dependency "1" -- "*" Etablissement : contains

    class ActivityService {
        +ActivityResponse createActivity(Long inspectorId, ActivityRequest request)
        +ActivityResponse updateActivity(Long inspectorId, Long activityId, ActivityRequest request)
        +void deleteActivity(Long inspectorId, Long activityId)
        +ActivityResponse getActivity(Long inspectorId, Long activityId)
        +List~ActivityResponse~ getAllActivities(Long inspectorId)
        +List~ActivityResponse~ getTeacherActivities(Long userId)
        +List~TeacherDto~ getAvailableTeachers()
    }

    class AdminService {
        +List~UserDto~ getPendingAccounts()
        +List~UserDto~ getAllUsers()
        +UserDto verifyAccount(Long userId)
        +UserDto assignRole(Long userId, Role role)
        +void deleteUser(Long userId)
    }

    class AnalyticsService {
        +InspectorAnalyticsDto getInspectorAnalytics(Long inspectorId)
        +AdminAnalyticsDto getAdminAnalytics()
        +TrendAnalyticsDto getTrends()
    }

    class AuthService {
        +UserDto register(RegisterRequest request)
        +LoginResponse login(LoginRequest request)
    }

    class CourseService {
        +CourseResponse createCourse(Long inspectorUserId, CourseCreateRequest request)
        +CourseResponse getCourseDetail(Long inspectorUserId, Long courseId)
        +List~CourseResponse~ getInspectorCourses(Long inspectorUserId)
        +CourseResponse publishCourse(Long inspectorUserId, Long courseId)
        +CourseResponse addModule(Long inspectorUserId, Long courseId, ModuleRequest moduleRequest)
        +void assignTeacher(Long inspectorUserId, Long courseId, Long teacherUserId)
        +void unassignTeacher(Long inspectorUserId, Long courseId, Long teacherUserId)
        +List~CourseResponse~ getCourseProgressOverview(Long inspectorUserId, Long courseId)
        +void deleteCourse(Long inspectorUserId, Long courseId)
        +void deleteModule(Long inspectorUserId, Long courseId, Long moduleId)
        +List~CourseResponse~ getTeacherCourses(Long teacherUserId)
        +CourseResponse getTeacherCourseDetail(Long teacherUserId, Long courseId)
        +void markLessonComplete(Long teacherUserId, Long lessonId, Integer score)
    }

    class DashboardService {
        +AdminDashboardDto getAdminDashboard()
        +InspectorDashboardDto getInspectorDashboard(String email)
        +TeacherDashboardDto getTeacherDashboard(String email)
        +ResponsibleDashboardDto getResponsibleDashboard(String email)
    }

    class FileStorageService {
        +String storeFile(MultipartFile file)
        +Path getFilePath(String fileName)
    }

    class InspectorProfileService {
        +InspectorProfileResponse completeProfile(Long userId, InspectorProfileRequest request)
        +InspectorProfileResponse updateProfile(Long userId, InspectorProfileRequest request)
        +InspectorProfileResponse getProfile(Long userId)
        +List~TeacherDto~ getMyTeachers(Long inspectorUserId)
        +String~~ getRanks()
        +String~~ getSubjects()
        +String~~ getSchoolLevels()
        +List~ReferenceDto~ getDelegations()
        +List~ReferenceDto~ getDependenciesByDelegation(Long delegationId)
        +List~ReferenceDto~ getDepartmentsByDelegation(Long delegationId)
        +List~EtablissementDto~ getEtablissementsByDependency(Long dependencyId)
        +List~EtablissementDto~ getEtablissementsByDependencyAndSchoolLevel(Long dependencyId, String schoolLevel)
        +List~TimetableDto~ getTeacherTimetable(Long inspectorUserId, Long teacherProfileId)
        +List~ReportResponse~ getTeacherReports(Long inspectorUserId, Long teacherProfileId)
        +List~QuizSubmissionResponse~ getTeacherQuizzes(Long inspectorUserId, Long teacherId)
    }

    class MessengerService {
        +List~ConversationDto~ getConversations(Long userId)
        +List~MessageDto~ getMessages(Long conversationId, Long userId)
        +MessageDto sendMessage(Long senderId, Long recipientId, String content, String fileUrl, String fileName, String fileType)
        +Object~~ getContacts(Long userId)
    }

    class NotificationService {
        +void sendNotification(Long recipientId, String title, String message, String type, String targetUrl)
        +List~NotificationDto~ getUserNotifications(Long userId)
        +long getUnreadCount(Long userId)
        +void markAsRead(Long notificationId, Long userId)
        +void markAllAsRead(Long userId)
    }

    class OnlineMeetingService {
        +String generateJitsiUrl(String activityTitle, Long activityId)
    }

    class PdfExportService {
        +byte[] exportReport(Long userId, Long reportId, boolean isTeacher)
        +void importReportPdf(Long inspectorId, Long reportId, String fileName, byte[] content)
        +String getReportPdfFileName(Long userId, Long reportId, boolean isTeacher)
    }

    class QuizService {
        +Object~~ generateAIQuestions(String topic, String subject)
        +QuizResponse saveQuiz(Long inspectorUserId, String title, String topic, String subject, Object~~ questionData)
        +List~QuizResponse~ getAvailableQuizzes(Long teacherUserId)
        +List~QuizResponse~ getInspectorQuizzes(Long inspectorUserId)
        +QuizResponse getQuizDetail(Long quizId)
        +Object~ submitQuiz(Long teacherUserId, Long quizId, String~ answers)
    }

    class ReportService {
        +ReportResponse createReport(Long inspectorId, ReportRequest request)
        +ReportResponse updateReport(Long inspectorId, Long reportId, ReportRequest request)
        +void deleteReport(Long inspectorId, Long reportId)
        +List~ReportResponse~ getReports(Long inspectorId, Long activityId)
        +List~ReportResponse~ getTeacherReports(Long teacherUserId)
    }

    class TeacherProfileService {
        +TeacherProfileResponse completeProfile(Long userId, TeacherProfileRequest request)
        +TeacherProfileResponse updateProfile(Long userId, TeacherProfileRequest request)
        +TeacherProfileResponse getProfile(Long userId)
    }

    class TimetableService {
        +List~TimetableDto~ getTimetable(Long userId)
        +TimetableDto addSlot(Long userId, TimetableDto dto)
        +void deleteSlot(Long userId, Long slotId)
    }

    class UserService {
        +UserDto getUserById(Long id)
        +UserDto getUserByEmail(String email)
        +List~UserDto~ getAllUsers()
        +void deleteUser(Long id)
    }
```

---

## 3. Diagrammes de Séquence (Sequence Diagrams)

### 3.1. Planification d'une Activité avec Réunion Teams
Ce diagramme montre le processus par lequel un inspecteur planifie une activité, génère un lien Teams, et le système notifie les enseignants.

```mermaid
sequenceDiagram
    actor Inspecteur
    participant UI as Interface Web
    participant ActivityCtrl as ActivityController
    participant ActivitySvc as ActivityService
    participant TeamsAPI as Microsoft Teams API
    participant NotificationSvc as NotificationService
    participant DB as Base de données

    Inspecteur->>UI: Remplit le formulaire de l'activité (Titre, Date, Invités, isOnline=true)
    UI->>ActivityCtrl: POST /api/activities
    ActivityCtrl->>ActivitySvc: createActivity(dto)
    
    alt isOnline == true
        ActivitySvc->>TeamsAPI: createOnlineMeeting()
        TeamsAPI-->>ActivitySvc: meetingUrl
    end
    
    ActivitySvc->>DB: save(Activity)
    DB-->>ActivitySvc: Activity créée
    
    loop Pour chaque enseignant invité
        ActivitySvc->>NotificationSvc: notifyTeacher(teacherId, "Nouvelle activité planifiée")
        NotificationSvc->>DB: save(Notification)
    end
    
    ActivitySvc-->>ActivityCtrl: Activity DTO
    ActivityCtrl-->>UI: 201 Created
    UI-->>Inspecteur: Affichage succès & Mise à jour de l'agenda
```

### 3.2. Passage d'un Quiz par un Enseignant
Ce diagramme détaille comment un enseignant passe un quiz et comment le score est calculé et notifié.

```mermaid
sequenceDiagram
    actor Enseignant
    participant UI as Interface Web
    participant QuizCtrl as QuizController
    participant QuizSvc as QuizService
    participant DB as Base de données

    Enseignant->>UI: Sélectionne "Démarrer le Quiz"
    UI->>QuizCtrl: GET /api/quizzes/{id}
    QuizCtrl->>QuizSvc: getQuizDetails()
    QuizSvc->>DB: findById(id)
    DB-->>QuizSvc: Quiz (sans les réponses correctes)
    QuizSvc-->>QuizCtrl: Quiz DTO
    QuizCtrl-->>UI: Affiche les questions
    
    Enseignant->>UI: Remplit les réponses et clique sur "Soumettre"
    UI->>QuizCtrl: POST /api/quizzes/{id}/submit (réponses)
    QuizCtrl->>QuizSvc: submitQuiz(answers)
    
    QuizSvc->>DB: Récupérer les bonnes réponses
    DB-->>QuizSvc: QuizQuestion (avec réponses)
    QuizSvc->>QuizSvc: calculateScore(answers)
    
    QuizSvc->>DB: save(QuizSubmission)
    
    QuizSvc-->>QuizCtrl: Score DTO
    QuizCtrl-->>UI: Affiche le résultat (Score)
    UI-->>Enseignant: Félicitations / Résultat final
```

### 3.3. Création d'un Quiz via l'Intelligence Artificielle
Ce diagramme illustre le flux de génération de questions de quiz par l'IA et la sauvegarde du quiz par l'inspecteur.

```mermaid
sequenceDiagram
    actor Inspecteur
    participant UI as Interface Web
    participant QuizCtrl as QuizController
    participant QuizSvc as QuizService
    participant AI_API as API IA (ex: Gemini/OpenAI)
    participant DB as Base de données

    Inspecteur->>UI: Saisit le Thème, la Matière et clique sur "Générer avec l'IA"
    UI->>QuizCtrl: GET /api/quizzes/generate?topic=...&subject=...
    QuizCtrl->>QuizSvc: generateAIQuestions(topic, subject)
    QuizSvc->>AI_API: Envoyer le prompt (Générer QCM en JSON)
    AI_API-->>QuizSvc: Réponse JSON (Questions et Options)
    QuizSvc-->>QuizCtrl: List<Map<String, Object>>
    QuizCtrl-->>UI: Questions générées
    UI-->>Inspecteur: Affiche l'aperçu du Quiz à valider

    Inspecteur->>UI: Valide, modifie si besoin, et clique sur "Enregistrer"
    UI->>QuizCtrl: POST /api/quizzes (QuizData)
    QuizCtrl->>QuizSvc: saveQuiz(inspectorUserId, title, topic, subject, questions)
    QuizSvc->>DB: save(Quiz)
    QuizSvc->>DB: saveAll(QuizQuestions)
    DB-->>QuizSvc: Quiz créé avec ID
    QuizSvc-->>QuizCtrl: QuizResponse DTO
    QuizCtrl-->>UI: 201 Created
    UI-->>Inspecteur: Succès (Quiz ajouté à la bibliothèque)
```

### 3.4. Authentification et Inscription (Authentication & Registration)
Ce diagramme montre le processus de création de compte où le système vérifie le code de série (Serial Code) du personnel de l'éducation nationale avant d'autoriser l'inscription.

```mermaid
sequenceDiagram
    actor Nouvel Utilisateur
    participant UI as Interface Web
    participant AuthCtrl as AuthController
    participant UserSvc as UserService
    participant DB as Base de données

    Nouvel Utilisateur->>UI: Saisit email, mot de passe et code série
    UI->>AuthCtrl: POST /api/auth/register (RegisterRequest)
    AuthCtrl->>UserSvc: register(request)
    UserSvc->>DB: findBySerialCode(code)
    DB-->>UserSvc: Personnel (Validation de l'identité et du rôle)
    UserSvc->>UserSvc: encryptPassword()
    UserSvc->>DB: save(User)
    DB-->>UserSvc: User créé
    UserSvc-->>AuthCtrl: UserDto
    AuthCtrl-->>UI: 200 OK + JWT Token
    UI-->>Nouvel Utilisateur: Redirection vers le profil / tableau de bord
```

### 3.5. Création et Assignation d'une Formation (Course Management)
Ce diagramme illustre le flux de gestion des cours, de la création par l'inspecteur à l'assignation aux enseignants.

```mermaid
sequenceDiagram
    actor Inspecteur
    participant UI as Interface Web
    participant CourseCtrl as CourseController
    participant CourseSvc as CourseService
    participant DB as Base de données

    Inspecteur->>UI: Crée une formation et ajoute des modules
    UI->>CourseCtrl: POST /api/courses
    CourseCtrl->>CourseSvc: createCourse(inspectorId, request)
    CourseSvc->>DB: save(Course)
    DB-->>CourseSvc: Course
    CourseSvc-->>CourseCtrl: CourseResponse
    CourseCtrl-->>UI: 201 Created

    Inspecteur->>UI: Assigne la formation à des enseignants
    UI->>CourseCtrl: POST /api/courses/{id}/assign/{teacherId}
    CourseCtrl->>CourseSvc: assignTeacher(inspectorId, courseId, teacherId)
    CourseSvc->>DB: update(Course)
    CourseSvc->>DB: save(Notification)
    DB-->>CourseSvc: Succès
    CourseSvc-->>CourseCtrl: void
    CourseCtrl-->>UI: 200 OK
    UI-->>Inspecteur: Formation assignée avec succès
```

### 3.6. Génération et Export de Rapport Pédagogique (PDF Export)
Ce diagramme détaille comment l'inspecteur génère une version PDF imprimable d'un rapport de visite ou d'activité.

```mermaid
sequenceDiagram
    actor Inspecteur
    participant UI as Interface Web
    participant ReportCtrl as ReportController
    participant ReportSvc as ReportService
    participant PdfSvc as PdfExportService
    participant DB as Base de données

    Inspecteur->>UI: Sélectionne un rapport et clique sur "Exporter PDF"
    UI->>ReportCtrl: GET /api/reports/{id}/export
    ReportCtrl->>ReportSvc: getReportDetail(id)
    ReportSvc->>DB: findById(id)
    DB-->>ReportSvc: ActivityReport
    ReportSvc-->>ReportCtrl: ReportResponse
    ReportCtrl->>PdfSvc: exportReport(inspectorId, reportId, false)
    PdfSvc->>PdfSvc: generatePdfBytes(ReportResponse)
    PdfSvc-->>ReportCtrl: byte[] (Fichier PDF)
    ReportCtrl-->>UI: 200 OK (application/pdf)
    UI-->>Inspecteur: Téléchargement du fichier PDF
```

### 3.7. Échange de Messages en Temps Réel (Messaging)
Flux d'envoi d'un message direct avec prise en charge éventuelle d'une pièce jointe.

```mermaid
sequenceDiagram
    actor Expéditeur
    participant UI as Interface Web
    participant MsgCtrl as MessengerController
    participant MsgSvc as MessengerService
    participant FileSvc as FileStorageService
    participant DB as Base de données

    Expéditeur->>UI: Tape un message (avec fichier joint) et envoie
    UI->>MsgCtrl: POST /api/messages (Multipart)
    alt Si fichier présent
        MsgCtrl->>FileSvc: storeFile(file)
        FileSvc-->>MsgCtrl: fileUrl
    end
    MsgCtrl->>MsgSvc: sendMessage(senderId, recipientId, content, fileUrl)
    MsgSvc->>DB: save(Message)
    DB-->>MsgSvc: Message créé
    MsgSvc-->>MsgCtrl: MessageDto
    MsgCtrl-->>UI: 200 OK
    UI-->>Expéditeur: Affiche le message envoyé
```

### 3.8. Planificateur de Notifications Automatiques (Scheduler)
Ce processus s'exécute en arrière-plan sans intervention humaine pour rappeler les activités à venir.

```mermaid
sequenceDiagram
    participant Scheduler as NotificationScheduler (Cron Job)
    participant ActivitySvc as ActivityService
    participant NotificationSvc as NotificationService
    participant DB as Base de données

    Scheduler->>Scheduler: Déclenchement automatique (@Scheduled)
    Scheduler->>ActivitySvc: getUpcomingActivities(24h)
    ActivitySvc->>DB: findActivitiesStartingWithin(24h, isReminderSent=false)
    DB-->>ActivitySvc: List<Activity>
    
    loop Pour chaque activité
        ActivitySvc->>ActivitySvc: Identifier les invités (TeacherProfiles)
        loop Pour chaque invité
            ActivitySvc->>NotificationSvc: sendNotification(userId, "Rappel: Activité imminente")
            NotificationSvc->>DB: save(Notification)
        end
        ActivitySvc->>DB: update(Activity) -> isReminderSent=true
    end
```

---

## 4. Diagramme d'Activité (Activity Diagram)

### Processus de rédaction et de publication d'un rapport pédagogique
Ce diagramme montre le flux de travail de la création à la validation et la publication d'un rapport.

```mermaid
stateDiagram-v2
    [*] --> Création_Rapport: Inspecteur termine une activité
    
    state Création_Rapport {
        [*] --> Saisie_Données: Remplir le contenu
        Saisie_Données --> Sauvegarde_Brouillon: Cliquer sur "Sauvegarder"
        Sauvegarde_Brouillon --> [*]
    }
    
    Création_Rapport --> Validation_Interne: Soumettre pour révision
    
    state Validation_Interne {
        [*] --> Vérification
        Vérification --> Modifications_Requises: Refusé
        Vérification --> Approuvé: Validé
    }
    
    Modifications_Requises --> Création_Rapport: Retour à l'inspecteur
    
    Approuvé --> Génération_PDF
    Génération_PDF --> Publication
    Publication --> Notification_Enseignants
    Notification_Enseignants --> [*]
```

---

## 5. Diagramme d'États-Transitions (State Machine Diagram)

### Cycle de vie d'un Rapport (Activity Report)
Ce diagramme représente les différents états par lesquels passe l'entité `ActivityReport`.

```mermaid
stateDiagram-v2
    [*] --> DRAFT : createReport()
    
    DRAFT --> DRAFT : updateContent()
    DRAFT --> IN_REVIEW : submitForValidation()
    
    IN_REVIEW --> DRAFT : reject() [Des corrections sont nécessaires]
    IN_REVIEW --> VALIDATED : approve() [Le rapport est conforme]
    
    VALIDATED --> PUBLISHED : publish() [Génération PDF & Visibilité]
    
    PUBLISHED --> ARCHIVED : archive() [Fin d'année scolaire]
    
    ARCHIVED --> [*]
```

## 6. Diagramme de Composants (Component Diagram - Optionnel pour PFE)
Vue macroscopique de l'architecture technique.

```mermaid
graph TD
    subgraph Frontend [Frontend (React / Vite)]
        UI[UI Components - Tailwind]
        State[State Management - Context/Redux]
        API_Client[Axios API Client]
    end

    subgraph Backend [Backend (Spring Boot)]
        Sec[Spring Security & JWT]
        Ctrl[REST Controllers]
        Svc[Service Layer]
        Repo[Data Access - Spring Data JPA]
    end

    subgraph External_Services [Services Externes]
        DB[(PostgreSQL)]
        MS_Teams[Microsoft Graph API / Teams]
    end

    UI --> State
    State --> API_Client
    API_Client -- HTTP / REST --> Sec
    Sec --> Ctrl
    Ctrl --> Svc
    Svc --> Repo
    Repo -- SQL --> DB
    Svc -- OAuth2 / REST --> MS_Teams
```
