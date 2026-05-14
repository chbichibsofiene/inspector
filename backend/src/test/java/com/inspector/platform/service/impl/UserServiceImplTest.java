package com.inspector.platform.service.impl;

import com.inspector.platform.dto.UserDto;
import com.inspector.platform.entity.User;
import com.inspector.platform.exception.UserNotFoundException;
import com.inspector.platform.repository.UserRepository;
import com.inspector.platform.service.LogService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private LogService logService;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void getUserById_Success() {
        User user = User.builder()
                .id(1L)
                .email("test@example.com")
                .build();
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        UserDto result = userService.getUserById(1L);

        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
    }

    @Test
    void getUserById_NotFound() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> userService.getUserById(99L));
    }

    @Test
    void deleteUser_Success() {
        when(userRepository.existsById(1L)).thenReturn(true);
        
        userService.deleteUser(1L);
        
        verify(userRepository).deleteById(1L);
        verify(logService).log(any(), anyString(), anyString(), anyString());
    }
}
