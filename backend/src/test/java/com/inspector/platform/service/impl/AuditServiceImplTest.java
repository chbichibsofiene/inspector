package com.inspector.platform.service.impl;

import com.inspector.platform.entity.ActionLog;
import com.inspector.platform.entity.User;
import com.inspector.platform.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuditServiceImplTest {

    @Mock
    private ActionLogRepository actionLogRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private PersonnelRepository personnelRepository;
    @Mock
    private ActivityReportRepository reportRepository;
    @Mock
    private InspectionRepository inspectionRepository;
    @Mock
    private TeacherProfileRepository teacherProfileRepository;
    @Mock
    private InspectorProfileRepository inspectorProfileRepository;

    @InjectMocks
    private AuditServiceImpl auditService;

    @Test
    void getUserHistory_ByUserId_Success() {
        String identifier = "1";
        ActionLog log = new ActionLog();
        when(actionLogRepository.findByUserIdOrderByCreatedAtDesc(1L)).thenReturn(Collections.singletonList(log));

        List<ActionLog> result = auditService.getUserHistory(identifier);

        assertNotNull(result);
        assertEquals(1, result.size());
    }

    @Test
    void getUserHistory_ByEmail_Success() {
        String identifier = "test@example.com";
        User user = User.builder().id(2L).email(identifier).build();
        when(userRepository.findByEmail(identifier)).thenReturn(Optional.of(user));
        when(actionLogRepository.findByUserIdOrderByCreatedAtDesc(2L)).thenReturn(Collections.emptyList());

        List<ActionLog> result = auditService.getUserHistory(identifier);

        assertNotNull(result);
        verify(actionLogRepository).findByUserIdOrderByCreatedAtDesc(2L);
    }

    @Test
    void logAction_Success() {
        User user = User.builder().id(1L).build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        auditService.logAction(1L, com.inspector.platform.entity.ActionType.CREATE, "Test", 1L, "Description");

        verify(actionLogRepository).save(any(ActionLog.class));
    }
}
