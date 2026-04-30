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

    @Override
    @Async
    public void sendAccountVerificationEmail(String to, String name) {
        log.info("Sending account verification email to {}", to);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "Inspector Platform");
            helper.setTo(to);
            helper.setSubject("Account Verified - Inspector Platform");
            
            String content = String.format(
                "<!DOCTYPE html><html><body style='margin: 0; padding: 0; background-color: #f3f4f6; font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;'>" +
                "<div style='background-color: #f3f4f6; padding: 60px 20px; min-height: 100vh;'>" +
                "  <div style='max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);'>" +
                "    <div style='background: #0033bb; padding: 40px; text-align: left;'>" +
                "      <img src='cid:logo' style='height: 45px; display: block;'>" +
                "    </div>" +
                "    <div style='padding: 50px 40px; color: #1f2937; line-height: 1.5;'>" +
                "      <h1 style='margin-top: 0; font-size: 28px; font-weight: 800; color: #0033bb; line-height: 1.2; letter-spacing: -0.02em;'>Account Verified. <br>Welcome to the platform.</h1>" +
                "      <p style='font-size: 16px; color: #4b5563; margin: 25px 0;'>Hello <strong>%s</strong>,</p>" +
                "      <p style='font-size: 16px; color: #4b5563;'>Great news! Your account has been <strong>successfully verified</strong> by our administration team. You now have full access to the Inspector Platform.</p>" +
                "      <div style='margin: 40px 0;'>" +
                "        <a href='http://localhost:3000/login' style='background: #0033bb; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; display: inline-block;'>Login to Dashboard</a>" +
                "      </div>" +
                "      <p style='color: #9ca3af; font-size: 14px; margin-top: 40px;'>If you have any questions, feel free to contact our support team.</p>" +
                "    </div>" +
                "  </div>" +
                "  <div style='max-width: 560px; margin: 30px auto 0; text-align: left; color: #9ca3af; font-size: 12px; line-height: 1.6;'>" +
                "    Inspector Platform is a specialized tool for educational monitoring and pedagogical training.<br><br>" +
                "    &copy; 2026 Inspector Platform. All Rights Reserved." +
                "  </div>" +
                "</div></body></html>",
                name
            );

            helper.setText(content, true);
            helper.addInline("logo", new ClassPathResource("static/logo.png"));
            mailSender.send(message);
            log.info("Successfully sent verification email to {}", to);
        } catch (Exception e) {
            log.error("Failed to send verification email to {}: {}", to, e.getMessage());
        }
    }
    
    @Override
    @Async
    public void sendRegistrationEmail(String to, String name) {
        log.info("Sending registration confirmation email to {}", to);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "Inspector Platform");
            helper.setTo(to);
            helper.setSubject("Welcome to Inspector Platform - Registration Successful");
            
            String content = String.format(
                "<!DOCTYPE html><html><body style='margin: 0; padding: 0; background-color: #f3f4f6; font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;'>" +
                "<div style='background-color: #f3f4f6; padding: 60px 20px; min-height: 100vh;'>" +
                "  <div style='max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);'>" +
                "    <div style='background: #0033bb; padding: 40px; text-align: left;'>" +
                "      <img src='cid:logo' style='height: 45px; display: block;'>" +
                "    </div>" +
                "    <div style='padding: 50px 40px; color: #1f2937; line-height: 1.5;'>" +
                "      <h1 style='margin-top: 0; font-size: 28px; font-weight: 800; color: #0033bb; line-height: 1.2; letter-spacing: -0.02em;'>Registration Successful! <br>Welcome onboard.</h1>" +
                "      <p style='font-size: 16px; color: #4b5563; margin: 25px 0;'>Hello <strong>%s</strong>,</p>" +
                "      <p style='font-size: 16px; color: #4b5563;'>Thank you for joining the <strong>Inspector Platform</strong>. Your registration has been received successfully.</p>" +
                "      <p style='font-size: 16px; color: #4b5563;'>Our administration team will review your account shortly. You will receive another email once your account is fully verified.</p>" +
                "      <hr style='border: 0; border-top: 1px solid #f3f4f6; margin: 40px 0;'>" +
                "      <p style='margin-bottom: 0; font-size: 13px; color: #9ca3af;'>Best regards,<br><strong style='color: #0033bb;'>Inspector Platform Team</strong></p>" +
                "    </div>" +
                "  </div>" +
                "  <div style='max-width: 560px; margin: 30px auto 0; text-align: left; color: #9ca3af; font-size: 12px; line-height: 1.6;'>" +
                "    Inspector Platform is a specialized tool for educational monitoring and pedagogical training.<br><br>" +
                "    &copy; 2026 Inspector Platform. All Rights Reserved." +
                "  </div>" +
                "</div></body></html>",
                name
            );

            helper.setText(content, true);
            helper.addInline("logo", new ClassPathResource("static/logo.png"));
            mailSender.send(message);
            log.info("Successfully sent registration email to {}", to);
        } catch (Exception e) {
            log.error("Failed to send registration email to {}: {}", to, e.getMessage());
        }
    }

    @Override
    @Async
    public void sendGenericNotificationEmail(String to, String name, String title, String messageContent, String actionUrl) {
        log.info("Sending generic notification email to {}", to);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "Inspector Platform");
            helper.setTo(to);
            helper.setSubject(title + " - Inspector Platform");

            String fullActionUrl = "http://localhost:3000" + (actionUrl.startsWith("/") ? actionUrl : "/" + actionUrl);
            
            String content = String.format(
                "<!DOCTYPE html><html><body style='margin: 0; padding: 0; background-color: #f3f4f6; font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;'>" +
                "<div style='background-color: #f3f4f6; padding: 60px 20px; min-height: 100vh;'>" +
                "  <div style='max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);'>" +
                "    <div style='background: #0033bb; padding: 40px; text-align: left;'>" +
                "      <img src='cid:logo' style='height: 45px; display: block;'>" +
                "    </div>" +
                "    <div style='padding: 50px 40px; color: #1f2937; line-height: 1.5;'>" +
                "      <h1 style='margin-top: 0; font-size: 28px; font-weight: 800; color: #0033bb; line-height: 1.2; letter-spacing: -0.02em;'>%s</h1>" +
                "      <p style='font-size: 16px; color: #4b5563; margin: 25px 0;'>Hello <strong>%s</strong>,</p>" +
                "      <p style='font-size: 16px; color: #4b5563;'>%s</p>" +
                "      <div style='margin: 40px 0;'>" +
                "        <a href='%s' style='background: #0033bb; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; display: inline-block;'>View Details</a>" +
                "      </div>" +
                "      <hr style='border: 0; border-top: 1px solid #f3f4f6; margin: 40px 0;'>" +
                "      <p style='margin-bottom: 0; font-size: 13px; color: #9ca3af;'>Best regards,<br><strong style='color: #0033bb;'>Inspector Platform Team</strong></p>" +
                "    </div>" +
                "  </div>" +
                "  <div style='max-width: 560px; margin: 30px auto 0; text-align: left; color: #9ca3af; font-size: 12px; line-height: 1.6;'>" +
                "    Inspector Platform is a specialized tool for educational monitoring and pedagogical training.<br><br>" +
                "    &copy; 2026 Inspector Platform. All Rights Reserved." +
                "  </div>" +
                "</div></body></html>",
                title,
                name,
                messageContent,
                fullActionUrl
            );

            helper.setText(content, true);
            helper.addInline("logo", new ClassPathResource("static/logo.png"));
            mailSender.send(message);
            log.info("Successfully sent generic notification email to {}", to);
        } catch (Exception e) {
            log.error("Failed to send generic notification email to {}: {}", to, e.getMessage());
        }
    }

    @Override
    @Async
    public void sendPasswordResetEmail(String to, String name, String code) {
        log.info("Sending password reset email to {}", to);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "Inspector Platform");
            helper.setTo(to);
            helper.setSubject("Password Reset Request - Inspector Platform");

            String content = String.format(
                "<!DOCTYPE html><html><body style='margin: 0; padding: 0; background-color: #f3f4f6; font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;'>" +
                "<div style='background-color: #f3f4f6; padding: 60px 20px; min-height: 100vh;'>" +
                "  <div style='max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);'>" +
                "    <div style='background: #0033bb; padding: 40px; text-align: left;'>" +
                "      <img src='cid:logo' style='height: 45px; display: block;'>" +
                "    </div>" +
                "    <div style='padding: 50px 40px; color: #1f2937; line-height: 1.5;'>" +
                "      <h1 style='margin-top: 0; font-size: 28px; font-weight: 800; color: #0033bb; line-height: 1.2; letter-spacing: -0.02em;'>Forgot your password? <br>It happens to the best of us.</h1>" +
                "      <p style='font-size: 16px; color: #4b5563; margin: 25px 0;'>Hello <strong>%s</strong>,</p>" +
                "      <p style='font-size: 16px; color: #4b5563;'>To reset your password, use the verification code below. This code will expire in 15 minutes.</p>" +
                "      <div style='margin: 40px 0; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px; text-align: center;'>" +
                "        <span style='font-size: 32px; font-weight: 800; letter-spacing: 0.3em; color: #0033bb;'>%s</span>" +
                "      </div>" +
                "      <p style='color: #9ca3af; font-size: 14px; margin-top: 40px;'>If you did not request a password reset, you can safely ignore this email.</p>" +
                "    </div>" +
                "  </div>" +
                "  <div style='max-width: 560px; margin: 30px auto 0; text-align: left; color: #9ca3af; font-size: 12px; line-height: 1.6;'>" +
                "    Inspector Platform Security Services.<br><br>" +
                "    &copy; 2026 Inspector Platform. All Rights Reserved." +
                "  </div>" +
                "</div></body></html>",
                name,
                code
            );

            helper.setText(content, true);
            helper.addInline("logo", new ClassPathResource("static/logo.png"));
            mailSender.send(message);
            log.info("Successfully sent password reset email to {}", to);
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}: {}", to, e.getMessage());
        }
    }

    @Override
    @Async
    public void sendSimpleEmail(String to, String subject, String body) {
        log.info("Sending styled simple email to {}", to);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "Inspector Platform");
            helper.setTo(to);
            helper.setSubject(subject + " - Inspector Platform");

            String content = String.format(
                "<!DOCTYPE html><html><body style='margin: 0; padding: 0; background-color: #f3f4f6; font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;'>" +
                "<div style='background-color: #f3f4f6; padding: 60px 20px; min-height: 100vh;'>" +
                "  <div style='max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);'>" +
                "    <div style='background: #0033bb; padding: 40px; text-align: left;'>" +
                "      <img src='cid:logo' style='height: 45px; display: block;'>" +
                "    </div>" +
                "    <div style='padding: 50px 40px; color: #1f2937; line-height: 1.5;'>" +
                "      <h1 style='margin-top: 0; font-size: 28px; font-weight: 800; color: #0033bb; line-height: 1.2; letter-spacing: -0.02em;'>%s</h1>" +
                "      <div style='color: #4b5563; font-size: 16px; margin: 25px 0;'>%s</div>" +
                "      <hr style='border: 0; border-top: 1px solid #f3f4f6; margin: 40px 0;'>" +
                "      <p style='margin-bottom: 0; font-size: 13px; color: #9ca3af;'>Best regards,<br><strong style='color: #0033bb;'>Inspector Platform Team</strong></p>" +
                "    </div>" +
                "  </div>" +
                "  <div style='max-width: 560px; margin: 30px auto 0; text-align: left; color: #9ca3af; font-size: 12px; line-height: 1.6;'>" +
                "    Inspector Platform is a specialized tool for educational monitoring and pedagogical training.<br><br>" +
                "    &copy; 2026 Inspector Platform. All Rights Reserved." +
                "  </div>" +
                "</div></body></html>",
                subject,
                body
            );

            helper.setText(content, true);
            helper.addInline("logo", new ClassPathResource("static/logo.png"));
            mailSender.send(message);
            log.info("Successfully sent styled simple email to {}", to);
        } catch (Exception e) {
            log.error("Failed to send styled simple email to {}: {}", to, e.getMessage());
        }
    }
}
