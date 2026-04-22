package com.inspector.platform.service.impl;

import com.inspector.platform.dto.EtablissementDto;
import com.inspector.platform.dto.ReferenceDto;
import com.inspector.platform.dto.TeacherProfileRequest;
import com.inspector.platform.dto.TeacherProfileResponse;
import com.inspector.platform.entity.*;
import com.inspector.platform.repository.*;
import com.inspector.platform.service.TeacherProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Slf4j
public class TeacherProfileServiceImpl implements TeacherProfileService {

    private final TeacherProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final DelegationRepository delegationRepository;
    private final DependencyRepository dependencyRepository;
    private final EtablissementRepository etablissementRepository;

    @Override
    @Transactional
    public TeacherProfileResponse completeProfile(Long userId, TeacherProfileRequest request) {

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

        Etablissement etablissement = etablissementRepository.findById(request.getEtablissementId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid etablissement ID"));

        TeacherProfile profile = TeacherProfile.builder()
                .user(user)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .subject(request.getSubject())
                .delegation(delegation)
                .dependency(dependency)
                .etablissement(etablissement)
                .phone(request.getPhone())
                .language(request.getLanguage())
                .build();

        TeacherProfile savedProfile = profileRepository.save(profile);

        user.setProfileCompleted(true);
        userRepository.save(user);

        log.info("Teacher profile completed for user {}", user.getEmail());

        return mapToResponse(savedProfile);
    }

    @Override
    @Transactional(readOnly = true)
    public TeacherProfileResponse getProfile(Long userId) {
        TeacherProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));
        return mapToResponse(profile);
    }

    @Override
    @Transactional
    public TeacherProfileResponse updateProfile(Long userId, TeacherProfileRequest request) {
        TeacherProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));

        Delegation delegation = delegationRepository.findById(request.getDelegationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid delegation ID"));

        Dependency dependency = dependencyRepository.findById(request.getDependencyId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid dependency ID"));

        Etablissement etablissement = etablissementRepository.findById(request.getEtablissementId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid etablissement ID"));

        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setSubject(request.getSubject());
        profile.setDelegation(delegation);
        profile.setDependency(dependency);
        profile.setEtablissement(etablissement);
        profile.setPhone(request.getPhone());
        profile.setLanguage(request.getLanguage());

        TeacherProfile updatedProfile = profileRepository.save(profile);
        return mapToResponse(updatedProfile);
    }

    private TeacherProfileResponse mapToResponse(TeacherProfile profile) {
        return TeacherProfileResponse.builder()
                .id(profile.getId())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .serialCode(profile.getUser().getSerialCode())
                .subject(profile.getSubject())
                .delegation(new ReferenceDto(profile.getDelegation().getId(), profile.getDelegation().getName()))
                .dependency(new ReferenceDto(profile.getDependency().getId(), profile.getDependency().getName()))
                .etablissement(new EtablissementDto(
                        profile.getEtablissement().getId(), 
                        profile.getEtablissement().getName(), 
                        profile.getEtablissement().getSchoolLevel()))
                .phone(profile.getPhone())
                .language(profile.getLanguage())
                .build();
    }
}
