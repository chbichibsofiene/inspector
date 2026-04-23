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
        +login()
        +register()
    }

    class InspectorProfile {
        +Long id
        +String firstName
        +String lastName
        +InspectorRank rank
        +Subject subject
        +SchoolLevel schoolLevel
        +String phone
    }

    class TeacherProfile {
        +Long id
        +String firstName
        +String lastName
        +Subject subject
        +SchoolLevel schoolLevel
        +String phone
        +boolean hasMicrosoftTeams
    }

    class Activity {
        +Long id
        +String title
        +String description
        +LocalDateTime startDateTime
        +LocalDateTime endDateTime
        +ActivityType type
        +String location
        +boolean isOnline
        +String meetingUrl
        +scheduleActivity()
    }

    class ActivityReport {
        +Long id
        +String content
        +ReportStatus status
        +String pdfUrl
        +LocalDateTime createdAt
        +generatePdf()
        +validateReport()
    }

    class Quiz {
        +Long id
        +String title
        +String description
        +int durationMinutes
        +LocalDateTime deadline
    }

    class QuizQuestion {
        +Long id
        +String text
        +List~String~ options
        +int correctOptionIndex
    }

    class QuizSubmission {
        +Long id
        +int score
        +LocalDateTime submittedAt
        +calculateScore()
    }

    class Notification {
        +Long id
        +String message
        +boolean isRead
        +LocalDateTime createdAt
    }

    class TimetableSlot {
        +Long id
        +String subject
        +String classLevel
        +DayOfWeek dayOfWeek
        +LocalTime startTime
        +LocalTime endTime
    }

    User "1" *-- "0..1" InspectorProfile : has
    User "1" *-- "0..1" TeacherProfile : has
    InspectorProfile "1" o-- "*" Activity : creates
    Activity "1" *-- "0..1" ActivityReport : generates
    Activity "1" o-- "*" TeacherProfile : guests
    InspectorProfile "1" o-- "*" Quiz : creates
    Quiz "1" *-- "*" QuizQuestion : contains
    TeacherProfile "1" o-- "*" QuizSubmission : submits
    Quiz "1" o-- "*" QuizSubmission : receives
    User "1" o-- "*" Notification : receives
    User "1" o-- "*" TimetableSlot : manages
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
