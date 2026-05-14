package com.inspector.platform.service;

import com.inspector.platform.dto.LoginRequest;
import com.inspector.platform.dto.LoginResponse;
import com.inspector.platform.dto.RegisterRequest;
import com.inspector.platform.dto.UserDto;

public interface AuthService {

    
    UserDto register(RegisterRequest request);

    
    LoginResponse login(LoginRequest request);
    void forgotPassword(String email);
    void resetPassword(String email, String code, String newPassword);
}

