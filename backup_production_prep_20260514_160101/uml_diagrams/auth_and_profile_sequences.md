# Authentication & Profile Setup Sequence Diagrams

This document contains UML sequence diagrams for the core identity and onboarding flows of the Inspector Platform.

## 1. User Registration Flow
This diagram illustrates how a user registers by validating their Serial Code and CIN against the national personnel database.

```mermaid
sequenceDiagram
    title: User Registration Flow
    autonumber
    participant USER as NEW USER
    participant FE as FRONT END
    participant AC as AuthController
    participant AS as AuthServiceImpl
    participant DB as Data Base
    participant NS as NotificationService

    Note over USER, NS: interaction : user registration validation

    USER->>FE: Inputs Email, Password, Serial Code, CIN
    FE->>AC: register(RegisterRequest)
    AC->>AS: register(request)
    
    AS->>DB: existsByEmail(email) / existsBySerialCode(code)
    DB-->>AS: boolean
    
    alt User already exists
        AS-->>AC: Email/SerialCodeAlreadyExistsException
        AC-->>FE: 400 Bad Request
        FE-->>USER: Display Error Message
    end

    AS->>DB: Query Authorized Personnel (Serial Code)
    DB-->>AS: Personnel Records (CIN, Role)

    Note right of AS: Validation: Serial Code exists AND CIN matches

    alt Credentials Mismatch (Personnel not found or CIN incorrect)
        AS-->>AC: PersonnelNotFoundException
        AC-->>FE: 403 Forbidden
        FE-->>USER: "Rejected: Credentials do not match records"
    end

    AS->>DB: save(New User Entity)
    DB-->>AS: savedUser

    AS->>NS: sendNotification(Welcome Message)
    NS-->>USER: In-app & Email Notification

    AS-->>AC: UserDto
    AC-->>FE: 201 Created
    FE-->>USER: Redirect to Login
```

## 2. User Login Flow
This diagram shows the secure authentication process using JWT tokens.

```mermaid
sequenceDiagram
    title: User Login Flow
    autonumber
    participant USER as USER
    participant FE as FRONT END
    participant AC as AuthController
    participant AS as AuthServiceImpl
    participant AM as AuthenticationManager
    participant JU as JwtUtil
    participant DB as Data Base

    Note over USER, DB: interaction : authentication and token generation

    USER->>FE: Inputs Email and Password
    FE->>AC: login(LoginRequest)
    AC->>AS: login(request)
    
    AS->>AM: authenticate(token)
    AM-->>AS: Authentication Object (Success/Failure)
    
    alt Authentication Fails
        AM-->>AS: BadCredentialsException
        AS-->>AC: 401 Unauthorized
        AC-->>FE: Error Message
        FE-->>USER: "Invalid Email or Password"
    end

    AS->>JU: generateToken(userDetails)
    JU-->>AS: JWT String

    AS->>DB: findByEmail(email)
    DB-->>AS: User Entity (Role, ProfileStatus)

    AS-->>AC: LoginResponse (JWT, Role, profileCompleted)
    AC-->>FE: 200 OK
    
    FE->>FE: Store JWT in LocalStorage
    
    alt Profile Not Completed
        FE-->>USER: Redirect to Profile Setup
    else Profile Completed
        FE-->>USER: Redirect to Dashboard (Inspector/Teacher)
    end
```

## 3. Teacher Profile Setup Flow
This diagram illustrates the specialized onboarding for teachers after their initial registration.

```mermaid
sequenceDiagram
    title: Teacher Profile Setup Flow
    autonumber
    participant USER as TEACHER
    participant FE as FRONT END
    participant PC as ProfileController
    participant TPS as TeacherProfileServiceImpl
    participant DB as Data Base

    Note over USER, DB: interaction : complete teacher profile

    USER->>FE: Inputs Subject, Phone, Language, School/Delegation
    FE->>PC: completeProfile(TeacherProfileRequest)
    PC->>TPS: completeProfile(userId, request)
    
    TPS->>DB: findById(userId)
    DB-->>TPS: User Entity
    
    TPS->>DB: findByReferenceIds(delegationId, etablissementId)
    DB-->>TPS: Reference Entities

    TPS->>DB: save(TeacherProfile)
    DB-->>TPS: savedProfile

    TPS->>DB: update user(profileCompleted=true)
    DB-->>TPS: updatedUser

    TPS-->>PC: TeacherProfileResponse
    PC-->>FE: 200 OK
    FE-->>USER: Redirect to Teacher Dashboard
```

## 4. Inspector Profile Setup Flow
This diagram illustrates the specialized onboarding for inspectors, including multi-jurisdiction assignments.

```mermaid
sequenceDiagram
    title: Inspector Profile Setup Flow
    autonumber
    participant USER as INSPECTOR
    participant FE as FRONT END
    participant PC as ProfileController
    participant IPS as InspectorProfileServiceImpl
    participant DB as Data Base

    Note over USER, DB: interaction : complete inspector profile

    USER->>FE: Inputs Rank, Subject, Multiple Delegations/Schools
    FE->>PC: completeProfile(InspectorProfileRequest)
    PC->>IPS: completeProfile(userId, request)
    
    IPS->>DB: findById(userId)
    DB-->>IPS: User Entity
    
    IPS->>DB: findAllByReferenceIds(delegationIds, etablissementIds...)
    DB-->>IPS: List of Jurisdiction Entities
    
    IPS->>DB: save(InspectorProfile)
    DB-->>IPS: savedProfile

    IPS->>DB: update user(profileCompleted=true)
    DB-->>IPS: updatedUser

    IPS-->>PC: InspectorProfileResponse
    PC-->>FE: 200 OK
    FE-->>USER: Redirect to Inspector Dashboard
```
