package com.inspector.platform.service.impl;

import com.inspector.platform.dto.UserDto;
import com.inspector.platform.entity.User;
import com.inspector.platform.repository.DelegationRepository;
import com.inspector.platform.repository.PersonnelRepository;
import com.inspector.platform.repository.RegionRepository;
import com.inspector.platform.repository.UserRepository;
import com.inspector.platform.service.NotificationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceImplTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PersonnelRepository personnelRepository;
    @Mock
    private RegionRepository regionRepository;
    @Mock
    private DelegationRepository delegationRepository;
    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private AdminServiceImpl adminService;

    @Test
    void getAllUsers_Success() {
        User user = User.builder()
                .id(1L)
                .email("user@example.com")
                .build();
        
        when(userRepository.findAll()).thenReturn(Collections.singletonList(user));

        List<UserDto> result = adminService.getAllUsers();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("user@example.com", result.get(0).getEmail());
    }

    @Test
    void getRegions_Success() {
        when(regionRepository.findAll()).thenReturn(Collections.emptyList());
        
        var result = adminService.getRegions();
        
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }
}
