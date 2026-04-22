package com.inspector.platform.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 150, message = "Email is too long")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @NotBlank(message = "Serial code is required")
    @Size(max = 100, message = "Serial code is too long")
    private String serialCode;

    @NotBlank(message = "CIN is required")
    @Size(min = 8, max = 8, message = "CIN must be exactly 8 characters")
    private String cin;
}

