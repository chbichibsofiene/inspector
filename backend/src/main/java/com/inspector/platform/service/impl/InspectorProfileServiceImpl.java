package com.inspector.platform.service.impl;

import com.inspector.platform.dto.InspectorProfileRequest;
import com.inspector.platform.dto.InspectorProfileResponse;
import com.inspector.platform.dto.ReferenceDto;
import com.inspector.platform.entity.*;
import com.inspector.platform.repository.*;
import com.inspector.platform.service.InspectorProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class InspectorProfileServiceImpl implements InspectorProfileService {

    private final InspectorProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final DelegationRepository delegationRepository;
    private final DependencyRepository dependencyRepository;
    private final DepartmentRepository departmentRepository;
    private final EtablissementRepository etablissementRepository;

    @Override
    @Transactional
    public InspectorProfileResponse completeProfile(Long userId, InspectorProfileRequest request) {
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
                
        if (user.isProfileCompleted()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Profile is already completed");
        }
        
        if (profileRepository.existsByUserId(userId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Profile already exists");
        }

        Delegation delegation = delegationRepository.findById(request.getDelegationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid delegation ID"));
                
        Dependency dependency = dependencyRepository.findById(request.getDependencyId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid dependency ID"));
                
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid department ID"));
                
        List<Etablissement> etablissements = etablissementRepository.findAllById(request.getEtablissementIds());
        if (etablissements.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid etablissement IDs");
        }

        InspectorProfile profile = InspectorProfile.builder()
                .user(user)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .rank(request.getRank())
                .phone(request.getPhone())
                .language(request.getLanguage())
                .delegation(delegation)
                .dependency(dependency)
                .department(department)
                .etablissements(etablissements)
                .build();

        InspectorProfile savedProfile = profileRepository.save(profile);
        
        user.setProfileCompleted(true);
        userRepository.save(user);

        log.info("Inspector profile completed for user {}", user.getEmail());
        
        return mapToResponse(savedProfile);
    }

    @Override
    public InspectorProfileResponse getProfile(Long userId) {
        InspectorProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));
        return mapToResponse(profile);
    }

    @Override
    public List<Map<String, String>> getRanks() {
        return Arrays.stream(InspectorRank.values())
                .map(rank -> Map.of(
                        "name", rank.name(),
                        "label", getRankLabel(rank)
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<ReferenceDto> getDelegations() {
        return delegationRepository.findAll().stream()
                .map(d -> new ReferenceDto(d.getId(), d.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ReferenceDto> getDependenciesByDelegation(Long delegationId) {
        return dependencyRepository.findByDelegationId(delegationId).stream()
                .map(d -> new ReferenceDto(d.getId(), d.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ReferenceDto> getDepartmentsByDelegation(Long delegationId) {
        return departmentRepository.findByDelegationId(delegationId).stream()
                .map(d -> new ReferenceDto(d.getId(), d.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ReferenceDto> getEtablissementsByDependency(Long dependencyId) {
        return etablissementRepository.findByDependencyId(dependencyId).stream()
                .map(e -> new ReferenceDto(e.getId(), e.getName()))
                .collect(Collectors.toList());
    }

    private InspectorProfileResponse mapToResponse(InspectorProfile profile) {
        return InspectorProfileResponse.builder()
                .id(profile.getId())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .rank(profile.getRank())
                .phone(profile.getPhone())
                .language(profile.getLanguage())
                .delegation(new ReferenceDto(profile.getDelegation().getId(), profile.getDelegation().getName()))
                .dependency(new ReferenceDto(profile.getDependency().getId(), profile.getDependency().getName()))
                .department(new ReferenceDto(profile.getDepartment().getId(), profile.getDepartment().getName()))
                .etablissements(profile.getEtablissements().stream()
                        .map(e -> new ReferenceDto(e.getId(), e.getName()))
                        .collect(Collectors.toList()))
                .build();
    }
    
    private String getRankLabel(InspectorRank rank) {
        switch (rank) {
            case INSPECTOR: return "Inspector";
            case INSPECTOR_PRINCIPAL: return "Inspector Principal";
            case INSPECTOR_GENERAL: return "Inspector General";
            case INSPECTOR_GENERAL_ADJOINT: return "Inspector General Adjoint";
            case INSPECTOR_REGIONAL: return "Inspector Regional";
            default: return rank.name();
        }
    }
}
