# Forgot Password Sequence Diagram (UML Style)

This diagram follows the project's architectural documentation style, illustrating the interactions between the User, Frontend, and Backend services.

## 🔄 Sequence: Password Recovery Flow

```mermaid
sequenceDiagram
    title: Password Recovery Flow
    autonumber
    participant USER as NEW USER
    participant FE as FRONT END
    participant AC as AuthController
    participant AS as AuthService
    participant DB as Data Base
    participant ES as EmailService

    Note over USER, ES: interaction : password recovery and reset flow

    USER->>FE: 1 : type email
    FE->>AC: 2 : Post-api-auth-forgot-password
    AC->>AS: 3 : forgotPassword(email)
    AS->>DB: 4 : Find By email
    
    alt email not found
        DB-->>AS: 5 : null
        AS-->>AC: 6 : UserNotFoundException
        AC-->>FE: 7 : 404 Not Found
        FE-->>USER: 8 : error message
    end

    rect rgb(240, 240, 255)
        Note right of AS: 9 : Generate 6-digit Code<br/>10 : Set Expiration (+15 min)
    end

    AS->>DB: 11 : Save(resetCode, expiry)
    AS->>ES: 12 : sendPasswordResetEmail(email, name, code)
    ES-->>USER: 13 : delivers reset email
    AS-->>AC: 14 : void
    AC-->>FE: 15 : 200-OK-CodeSent
    FE-->>USER: 16 : display verification step

    Note over USER, ES: Step 2: Verification and Password Update

    USER->>FE: 17 : type code , email , new password
    FE->>AC: 18 : Post-api-auth-reset-password
    AC->>AS: 19 : resetPassword(email, code, newPassword)
    AS->>DB: 20 : Find by email
    DB-->>AS: 21 : UserObject

    alt code invalid or expired
        AS-->>AC: 22 : InvalidCodeException
        AC-->>FE: 23 : 400 Bad Request
        FE-->>USER: 24 : error message
    end

    Note right of AS: 25 : hashPassword
    AS->>DB: 26 : Save(UserObject-NewPassword)
    DB-->>AS: 27 : UserObject
    AS-->>AC: 28 : void
    AC-->>FE: 29 : 200-OK-ResetSuccess
    FE-->>USER: 30 : login redirection
```

## 📋 Sequence Breakdown

| Step | Action | Description |
| :--- | :--- | :--- |
| **1-8** | **Email Validation** | Verifies if the email exists in the system. Returns a 404 if the user is unknown. |
| **9-11** | **Code Generation** | Creates a temporary 6-digit token and persists it with a 15-minute TTL. |
| **12-16** | **Notification** | Triggers the `EmailService` to send the branded HTML email to the user. |
| **17-24** | **Verification** | Validates the user-provided code against the database record and checks for expiration. |
| **25-30** | **Finalization** | Re-hashes the new password and updates the user record, clearing the reset fields. |
