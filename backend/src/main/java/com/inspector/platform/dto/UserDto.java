package com.inspector.platform.dto;

import com.inspector.platform.entity.Role;
import com.inspector.platform.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private Long id;
    private String email;
    private String serialCode;
    private Role role;
    private boolean enabled;
    private LocalDateTime createdAt;
    private boolean isMicrosoftConnected;

    
    public static UserDto from(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .serialCode(user.getSerialCode())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .isMicrosoftConnected(user.isMicrosoftConnected())
                .createdAt(user.getCreatedAt())
                .build();
    }
}

