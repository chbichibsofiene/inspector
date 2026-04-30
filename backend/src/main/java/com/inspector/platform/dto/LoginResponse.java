package com.inspector.platform.dto;

import com.inspector.platform.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String token;
    @Builder.Default
    private String tokenType = "Bearer";
    private String email;
    private Role role;
    private Long userId;
    private boolean profileCompleted;
    private String profileImageUrl;
}
