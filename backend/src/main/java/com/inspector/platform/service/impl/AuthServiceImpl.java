package com.inspector.platform.service.impl;

import com.inspector.platform.dto.LoginRequest;
import com.inspector.platform.dto.LoginResponse;
import com.inspector.platform.dto.RegisterRequest;
import com.inspector.platform.dto.UserDto;
import com.inspector.platform.entity.User;
import com.inspector.platform.exception.AccountNotVerifiedException;
import com.inspector.platform.exception.EmailAlreadyExistsException;
import com.inspector.platform.exception.PersonnelNotFoundException;
import com.inspector.platform.exception.SerialCodeAlreadyExistsException;
import com.inspector.platform.repository.PersonnelRepository;
import com.inspector.platform.repository.UserRepository;
import com.inspector.platform.security.JwtUtil;
import com.inspector.platform.service.AuthService;
import com.inspector.platform.service.NotificationService;
import com.inspector.platform.service.EmailService;
import com.inspector.platform.service.LogService;
import com.inspector.platform.entity.ActionType;
import com.inspector.platform.repository.InspectorProfileRepository;
import com.inspector.platform.repository.TeacherProfileRepository;
import com.inspector.platform.entity.Role;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PersonnelRepository personnelRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final LogService logService;
    private final NotificationService notificationService;
    private final EmailService emailService;
    private final InspectorProfileRepository inspectorProfileRepository;
    private final TeacherProfileRepository teacherProfileRepository;

    @Override
    @Transactional
    public UserDto register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(
                    "Email is already registered: " + request.getEmail());
        }
        if (userRepository.existsBySerialCode(request.getSerialCode())) {
            throw new SerialCodeAlreadyExistsException(
                    "Serial code is already in use: " + request.getSerialCode());
        }

        // Verify serial code and CIN against Personnel table
        var personnel = personnelRepository.findBySerialCode(request.getSerialCode())
                .filter(p -> p.getCin().equals(request.getCin()))
                .orElseThrow(() -> new PersonnelNotFoundException(
                        "Registration rejected: Serial code and CIN do not match our authorized personnel records."));

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .serialCode(request.getSerialCode())
                .role(personnel.getRole())
                .enabled(true)
                .build();

        User saved = userRepository.save(user);
        logService.log(saved, ActionType.CREATE, "User", saved.getId().toString(), "User registered", null);
        log.info("New user registered and auto-enabled: {} as {}", saved.getEmail(), saved.getRole());

        // Send notification (In-app + Email via NotificationService)
        notificationService.sendNotification(
            saved.getId(),
            personnel.getFirstName() + " " + personnel.getLastName(),
            "Welcome to the Inspector Platform! Your registration was successful.",
            "REGISTRATION_SUCCESS",
            "/profile"
        );

        return UserDto.from(saved);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()));

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtUtil.generateToken(userDetails);

            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow();

            logService.log(user, ActionType.LOGIN, "User", user.getId().toString(), "User logged in", null);
            log.info("User logged in: {} [{}]", user.getEmail(), user.getRole());

            return LoginResponse.builder()
                    .token(token)
                    .tokenType("Bearer")
                    .email(user.getEmail())
                    .role(user.getRole())
                    .userId(user.getId())
                    .profileCompleted(user.isProfileCompleted())
                    .profileImageUrl(user.getProfileImageUrl())
                    .build();

        } catch (DisabledException e) {

            throw new AccountNotVerifiedException(
                    "Your account has not been verified yet. Please contact the administrator.");
        }
    }

    @Override
    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        // Generate 6-digit code
        String code = String.format("%06d", new java.util.Random().nextInt(1000000));
        user.setResetCode(code);
        user.setResetCodeExpiresAt(java.time.LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        String fullName = getFullName(user);
        emailService.sendPasswordResetEmail(email, fullName, code);
        log.info("Password reset code sent to {}", email);
    }

    @Override
    @Transactional
    public void resetPassword(String email, String code, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        if (user.getResetCode() == null || !user.getResetCode().equals(code)) {
            throw new RuntimeException("Invalid reset code");
        }

        if (user.getResetCodeExpiresAt().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Reset code has expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetCode(null);
        user.setResetCodeExpiresAt(null);
        userRepository.save(user);

        logService.log(user, com.inspector.platform.entity.ActionType.UPDATE, "User", user.getId().toString(), "Password reset successfully", null);
        log.info("Password reset successfully for user: {}", email);
    }

    private String getFullName(User user) {
        if (user.getRole() == Role.INSPECTOR) {
            return inspectorProfileRepository.findByUserId(user.getId())
                    .map(p -> p.getFirstName() + " " + p.getLastName())
                    .orElse(user.getEmail());
        } else {
            return teacherProfileRepository.findByUserId(user.getId())
                    .map(p -> p.getFirstName() + " " + p.getLastName())
                    .orElse(user.getEmail());
        }
    }
}
