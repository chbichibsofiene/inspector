package com.inspector.platform.service.impl;

import com.inspector.platform.dto.LoginRequest;
import com.inspector.platform.dto.LoginResponse;
import com.inspector.platform.dto.RegisterRequest;
import com.inspector.platform.dto.UserDto;
import com.inspector.platform.entity.Role;
import com.inspector.platform.entity.User;
import com.inspector.platform.exception.AccountNotVerifiedException;
import com.inspector.platform.exception.EmailAlreadyExistsException;
import com.inspector.platform.exception.PersonnelNotFoundException;
import com.inspector.platform.exception.SerialCodeAlreadyExistsException;
import com.inspector.platform.repository.PersonnelRepository;
import com.inspector.platform.repository.UserRepository;
import com.inspector.platform.security.JwtUtil;
import com.inspector.platform.service.AuthService;
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
        log.info("New user registered and auto-enabled: {} as {}", saved.getEmail(), saved.getRole());

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

            log.info("User logged in: {} [{}]", user.getEmail(), user.getRole());

            return LoginResponse.builder()
                    .token(token)
                    .tokenType("Bearer")
                    .email(user.getEmail())
                    .role(user.getRole())
                    .userId(user.getId())
                    .profileCompleted(user.isProfileCompleted())
                    .build();

        } catch (DisabledException e) {

            throw new AccountNotVerifiedException(
                    "Your account has not been verified yet. Please contact the administrator.");
        }
    }
}
