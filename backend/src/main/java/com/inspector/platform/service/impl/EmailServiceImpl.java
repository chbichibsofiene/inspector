package com.inspector.platform.service.impl;

import com.inspector.platform.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final String fromEmail;

    public EmailServiceImpl(JavaMailSender mailSender, @Value("${spring.mail.username}") String fromEmail) {
        this.mailSender = mailSender;
        this.fromEmail = fromEmail;
    }

    private String buildEmailTemplate(String title, String body, String actionText, String actionUrl) {
        String actionButton = "";
        if (actionText != null && actionUrl != null) {
            actionButton = String.format(
                "      <div style='margin: 40px 0; text-align: center;'>" +
                "        <a href='%s' style='background: #1a56db; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);'>%s</a>" +
                "      </div>",
                actionUrl, actionText
            );
        }

        return String.format(
            "<!DOCTYPE html><html>" +
            "<head>" +
            "  <style>body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%%; -ms-text-size-adjust: 100%%; }</style>" +
            "</head>" +
            "<body style='margin: 0; padding: 0; background-color: #f9fafb; font-family: \"Inter\", \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif;'>" +
            "  <table role='presentation' width='100%%' cellspacing='0' cellpadding='0' border='0'>" +
            "    <tr>" +
            "      <td align='center' style='padding: 0;'>" +
            "        <table role='presentation' width='600' cellspacing='0' cellpadding='0' border='0' style='background-color: #ffffff; margin-top: 40px; margin-bottom: 40px; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);'>" +
            "          <tr>" +
            "            <td align='center' style='background-color: #1e3a8a; padding: 40px 0;'>" +
            "              <img src='cid:logo' alt='Pedagogy Center' style='height: 60px; display: block;'>" +
            "            </td>" +
            "          </tr>" +
            "          <!-- Body -->" +
            "          <tr>" +
            "            <td style='padding: 50px 50px 40px 50px;'>" +
            "              <h1 style='margin: 0 0 30px 0; font-size: 32px; font-weight: 800; color: #111827; line-height: 1.2; text-align: center; letter-spacing: -0.025em;'>%s</h1>" +
            "              <div style='font-size: 16px; color: #4b5563; line-height: 1.7; text-align: center;'>" +
            "                %s" +
            "              </div>" +
            "              %s" +
            "            </td>" +
            "          </tr>" +
            "          <!-- Footer -->" +
            "          <tr>" +
            "            <td align='center' style='padding: 40px; background-color: #f3f4f6; border-top: 1px solid #e5e7eb;'>" +
            "              <div style='margin-bottom: 20px;'>" +
            "                <a href='https://www.facebook.com/cnteducation/?locale=fr_FR' style='margin: 0 10px;'><img src='https://cdn-icons-png.flaticon.com/512/733/733547.png' width='24' style='opacity: 0.6;'></a>" +
            "                <a href='#' style='margin: 0 10px;'><img src='https://cdn-icons-png.flaticon.com/512/733/733558.png' width='24' style='opacity: 0.6;'></a>" +
            "              </div>" +
            "              <div href='https://www.cnte.tn/' style='font-size: 14px; color: #6b7280; font-weight: 500; margin-bottom: 8px;'>www.cnte.tn</div>" +
            "              <div style='font-size: 12px; color: #9ca3af; margin-bottom: 12px;'>Specialized Inspectorate Division</div>" +
            "              <div style='font-size: 12px; color: #9ca3af;'>&copy; 2026 Pedagogy Center. All Rights Reserved.</div>" +
            "            </td>" +
            "          </tr>" +
            "        </table>" +
            "      </td>" +
            "    </tr>" +
            "  </table>" +
            "</body>" +
            "</html>",
            title, body, actionButton
        );
    }

    @Override
    @Async
    public void sendAccountVerificationEmail(String to, String name) {
        log.info("Sending account verification email to {}", to);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "Pedagogy Center");
            helper.setTo(to);
            helper.setSubject("Account Verified - Pedagogy Center");
            
            String body = String.format(
                "Hello <strong>%s</strong>,<br><br>" +
                "Great news! Your account has been <strong>successfully verified</strong> by our administration team. " +
                "You now have full access to the Inspector Platform features and resources.",
                name
            );

            String content = buildEmailTemplate(
                "Account Verified. Welcome onboard.",
                body,
                "Login to Dashboard",
                "http://localhost:5173/login"
            );

            helper.setText(content, true);
            helper.addInline("logo", new ClassPathResource("static/logo.png"));
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send verification email: {}", e.getMessage());
        }
    }
    
    @Override
    @Async
    public void sendRegistrationEmail(String to, String name) {
        log.info("Sending registration confirmation email to {}", to);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "Pedagogy Center");
            helper.setTo(to);
            helper.setSubject("Welcome to Inspector Platform - Registration Successful");
            
            String body = String.format(
                "Hello <strong>%s</strong>,<br><br>" +
                "Thank you for joining the <strong>Inspector Platform</strong>. Your registration has been received successfully.<br><br>" +
                "Our administration team will review your credentials shortly. You will receive another notification once your account is activated.",
                name
            );

            String content = buildEmailTemplate(
                "Registration Received!",
                body,
                null,
                null
            );

            helper.setText(content, true);
            helper.addInline("logo", new ClassPathResource("static/logo.png"));
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send registration email: {}", e.getMessage());
        }
    }

    @Override
    @Async
    public void sendGenericNotificationEmail(String to, String name, String title, String messageContent, String actionUrl) {
        log.info("Sending generic notification email to {}", to);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "Pedagogy Center");
            helper.setTo(to);
            helper.setSubject(title + " - Pedagogy Center");

            String fullActionUrl = "http://localhost:5173" + (actionUrl.startsWith("/") ? actionUrl : "/" + actionUrl);
            
            String body = String.format(
                "Hello <strong>%s</strong>,<br><br>%s",
                name, messageContent
            );

            String content = buildEmailTemplate(
                title,
                body,
                "View Details",
                fullActionUrl
            );

            helper.setText(content, true);
            helper.addInline("logo", new ClassPathResource("static/logo.png"));
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send notification email: {}", e.getMessage());
        }
    }

    @Override
    @Async
    public void sendPasswordResetEmail(String to, String name, String code) {
        log.info("Sending password reset email to {}", to);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "Pedagogy Center");
            helper.setTo(to);
            helper.setSubject("Password Reset Request - Pedagogy Center");

            String body = String.format(
                "Hello <strong>%s</strong>,<br><br>" +
                "To reset your password, please use the verification code below. This code will expire in 15 minutes.<br><br>" +
                "<div style='background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;'>" +
                "  <span style='font-size: 32px; font-weight: 800; letter-spacing: 0.3em; color: #1a56db;'>%s</span>" +
                "</div>",
                name, code
            );

            String content = buildEmailTemplate(
                "Reset Your Password",
                body,
                null,
                null
            );

            helper.setText(content, true);
            helper.addInline("logo", new ClassPathResource("static/logo.png"));
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send reset email: {}", e.getMessage());
        }
    }

    @Override
    @Async
    public void sendSimpleEmail(String to, String subject, String bodyText) {
        log.info("Sending simple styled email to {}", to);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "Pedagogy Center");
            helper.setTo(to);
            helper.setSubject(subject + " - Pedagogy Center");

            String content = buildEmailTemplate(
                subject,
                bodyText,
                null,
                null
            );

            helper.setText(content, true);
            helper.addInline("logo", new ClassPathResource("static/logo.png"));
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send simple email: {}", e.getMessage());
        }
    }
}
