package com.inspector.platform.service.impl;

import com.inspector.platform.dto.EtablissementDto;
import com.inspector.platform.dto.InspectorProfileRequest;
import com.inspector.platform.dto.InspectorProfileResponse;
import com.inspector.platform.dto.ReferenceDto;
import com.inspector.platform.dto.TeacherDto;
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
    private final TeacherProfileRepository teacherProfileRepository;

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
                .subject(request.getSubject())
                .schoolLevel(request.getSchoolLevel())
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
    @Transactional
    public InspectorProfileResponse updateProfile(Long userId, InspectorProfileRequest request) {
        InspectorProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));

        Delegation delegation = delegationRepository.findById(request.getDelegationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid delegation ID"));

        Dependency dependency = dependencyRepository.findById(request.getDependencyId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid dependency ID"));

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid department ID"));

        List<Etablissement> etablissements = etablissementRepository.findAllById(request.getEtablissementIds());

        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setRank(request.getRank());
        profile.setSubject(request.getSubject());
        profile.setSchoolLevel(request.getSchoolLevel());
        profile.setPhone(request.getPhone());
        profile.setLanguage(request.getLanguage());
        profile.setDelegation(delegation);
        profile.setDependency(dependency);
        profile.setDepartment(department);
        profile.setEtablissements(etablissements);

        InspectorProfile updatedProfile = profileRepository.save(profile);
        return mapToResponse(updatedProfile);
    }

    @Override
    public List<TeacherDto> getMyTeachers(Long inspectorUserId) {
        InspectorProfile inspector = profileRepository.findByUserId(inspectorUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Inspector profile not found"));
                
        List<TeacherProfile> teachers = teacherProfileRepository.findByDelegationIdAndDependencyIdAndSubject(
                inspector.getDelegation().getId(),
                inspector.getDependency().getId(),
                inspector.getSubject()
        );
        
        return teachers.stream().map(t -> TeacherDto.builder()
                .id(t.getId())
                .firstName(t.getFirstName())
                .lastName(t.getLastName())
                .email(t.getUser().getEmail())
                .serialCode(t.getUser().getSerialCode())
                .etablissement(new EtablissementDto(t.getEtablissement().getId(), t.getEtablissement().getName(), t.getEtablissement().getSchoolLevel()))
                .build()).collect(Collectors.toList());
    }

    @Override
    public List<Map<String, String>> getRanks() {
        return Arrays.stream(InspectorRank.values())
                .map(rank -> Map.of("name", rank.name(), "label", toLabel(rank.name())))
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, String>> getSubjects() {
        return Arrays.stream(Subject.values())
                .map(s -> Map.of("name", s.name(), "label", toLabel(s.name())))
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, String>> getSchoolLevels() {
        return Arrays.stream(SchoolLevel.values())
                .map(l -> Map.of("name", l.name(), "label", toLabel(l.name())))
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
    public List<EtablissementDto> getEtablissementsByDependency(Long dependencyId) {
        return etablissementRepository.findByDependencyId(dependencyId).stream()
                .map(e -> new EtablissementDto(e.getId(), e.getName(), e.getSchoolLevel()))
                .collect(Collectors.toList());
    }

    @Override
    public List<EtablissementDto> getEtablissementsByDependencyAndSchoolLevel(Long dependencyId, String schoolLevelStr) {
        try {
            SchoolLevel level = SchoolLevel.valueOf(schoolLevelStr);
            return etablissementRepository.findByDependencyIdAndSchoolLevel(dependencyId, level).stream()
                    .map(e -> new EtablissementDto(e.getId(), e.getName(), e.getSchoolLevel()))
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid school level");
        }
    }

    private InspectorProfileResponse mapToResponse(InspectorProfile profile) {
        return InspectorProfileResponse.builder()
                .id(profile.getId())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .rank(profile.getRank())
                .subject(profile.getSubject())
                .schoolLevel(profile.getSchoolLevel())
                .phone(profile.getPhone())
                .language(profile.getLanguage())
                .delegation(new ReferenceDto(profile.getDelegation().getId(), profile.getDelegation().getName()))
                .dependency(new ReferenceDto(profile.getDependency().getId(), profile.getDependency().getName()))
                .department(new ReferenceDto(profile.getDepartment().getId(), profile.getDepartment().getName()))
                .etablissements(profile.getEtablissements().stream()
                        .map(e -> new EtablissementDto(e.getId(), e.getName(), e.getSchoolLevel()))
                        .collect(Collectors.toList()))
                .build();
    }

    /** Converts SNAKE_CASE enum names to "Title Case" labels */
    private String toLabel(String enumName) {
        String[] parts = enumName.split("_");
        StringBuilder sb = new StringBuilder();
        for (String part : parts) {
            if (sb.length() > 0) sb.append(" ");
            sb.append(part.charAt(0)).append(part.substring(1).toLowerCase());
        }
        return sb.toString();
    }
}
