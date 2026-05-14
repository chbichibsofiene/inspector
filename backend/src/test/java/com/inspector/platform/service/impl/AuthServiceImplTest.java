package com.inspector.platform.service.impl;

import com.inspector.platform.dto.LoginRequest;
import com.inspector.platform.dto.LoginResponse;
import com.inspector.platform.dto.RegisterRequest;
import com.inspector.platform.dto.UserDto;
import com.inspector.platform.entity.Personnel;
import com.inspector.platform.entity.Role;
import com.inspector.platform.entity.User;
import com.inspector.platform.exception.EmailAlreadyExistsException;
import com.inspector.platform.repository.*;
import com.inspector.platform.security.JwtUtil;
import com.inspector.platform.service.EmailService;
import com.inspector.platform.service.LogService;
import com.inspector.platform.service.NotificationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PersonnelRepository personnelRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JwtUtil jwtUtil;
    @Mock
    private LogService logService;
    @Mock
    private NotificationService notificationService;
    @Mock
    private EmailService emailService;
    @Mock
    private InspectorProfileRepository inspectorProfileRepository;
    @Mock
    private TeacherProfileRepository teacherProfileRepository;

    @InjectMocks
    private AuthServiceImpl authService;

    @Test
    void register_Success() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setPassword("password");
        request.setSerialCode("12345");
        request.setCin("12345678");

        Personnel personnel = new Personnel();
        personnel.setSerialCode("12345");
        personnel.setCin("12345678");
        personnel.setRole(Role.TEACHER);

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.existsBySerialCode(anyString())).thenReturn(false);
        when(personnelRepository.findBySerialCode(anyString())).thenReturn(Optional.of(personnel));
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        
        User savedUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .role(Role.TEACHER)
                .build();
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        UserDto result = authService.register(request);

        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_EmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("existing@example.com");

        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        assertThrows(EmailAlreadyExistsException.class, () -> authService.register(request));
    }

    @Test
    void login_Success() {
        LoginRequest request = new LoginRequest("test@example.com", "password");
        Authentication authentication = mock(Authentication.class);
        UserDetails userDetails = mock(UserDetails.class);
        
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(jwtUtil.generateToken(any(UserDetails.class))).thenReturn("mockToken");
        
        User user = User.builder()
                .id(1L)
                .email("test@example.com")
                .role(Role.ADMIN)
                .build();
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mockToken", response.getToken());
        assertEquals("test@example.com", response.getEmail());
    }
}
