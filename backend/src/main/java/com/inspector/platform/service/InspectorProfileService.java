package com.inspector.platform.service;

import com.inspector.platform.dto.InspectorProfileRequest;
import com.inspector.platform.dto.InspectorProfileResponse;
import com.inspector.platform.dto.ReferenceDto;

import java.util.List;
import java.util.Map;

public interface InspectorProfileService {
    
    InspectorProfileResponse completeProfile(Long userId, InspectorProfileRequest request);
    
    InspectorProfileResponse getProfile(Long userId);
    
    List<Map<String, String>> getRanks();
    
    List<ReferenceDto> getDelegations();
    
    List<ReferenceDto> getDependenciesByDelegation(Long delegationId);
    
    List<ReferenceDto> getDepartmentsByDelegation(Long delegationId);
    
    List<ReferenceDto> getEtablissementsByDependency(Long dependencyId);
}
