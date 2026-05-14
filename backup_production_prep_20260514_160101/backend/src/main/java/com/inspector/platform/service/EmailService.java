package com.inspector.platform.service;

public interface EmailService {
    void sendAccountVerificationEmail(String to, String name);
    void sendRegistrationEmail(String to, String name);
    void sendGenericNotificationEmail(String to, String name, String title, String message, String actionUrl);
    void sendPasswordResetEmail(String to, String name, String code);
    void sendSimpleEmail(String to, String subject, String body);
}
