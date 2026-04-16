package com.inspector.platform.service;

import com.inspector.platform.dto.EtablissementDto;
import com.inspector.platform.dto.InspectorProfileRequest;
import com.inspector.platform.dto.InspectorProfileResponse;
import com.inspector.platform.dto.ReferenceDto;
import com.inspector.platform.dto.TeacherDto;

import java.util.List;
import java.util.Map;

public interface InspectorProfileService {
    
    InspectorProfileResponse completeProfile(Long userId, InspectorProfileRequest request);
    InspectorProfileResponse updateProfile(Long userId, InspectorProfileRequest request);
    InspectorProfileResponse getProfile(Long userId);
    
    List<TeacherDto> getMyTeachers(Long inspectorUserId);
    
    List<Map<String, String>> getRanks();
    
    List<Map<String, String>> getSubjects();
    
    List<Map<String, String>> getSchoolLevels();
    
    List<ReferenceDto> getDelegations();
    
    List<ReferenceDto> getDependenciesByDelegation(Long delegationId);
    
    List<ReferenceDto> getDepartmentsByDelegation(Long delegationId);
    
    List<EtablissementDto> getEtablissementsByDependency(Long dependencyId);
    List<EtablissementDto> getEtablissementsByDependencyAndSchoolLevel(Long dependencyId, String schoolLevel);
}
