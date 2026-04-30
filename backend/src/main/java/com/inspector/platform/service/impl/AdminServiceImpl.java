package com.inspector.platform.service.impl;

import com.inspector.platform.dto.UserDto;
import com.inspector.platform.dto.RegionDto;
import com.inspector.platform.dto.DelegationDto;
import com.inspector.platform.entity.Personnel;
import com.inspector.platform.entity.Role;
import com.inspector.platform.entity.User;
import com.inspector.platform.exception.UserNotFoundException;
import com.inspector.platform.repository.PersonnelRepository;
import com.inspector.platform.repository.UserRepository;
import com.inspector.platform.repository.RegionRepository;
import com.inspector.platform.repository.DelegationRepository;
import com.inspector.platform.service.AdminService;
import com.inspector.platform.service.NotificationService;
import com.inspector.platform.entity.Region;
import com.inspector.platform.entity.Delegation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final PersonnelRepository personnelRepository;
    private final RegionRepository regionRepository;
    private final DelegationRepository delegationRepository;
    private final NotificationService notificationService;



    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream().map(user -> {
            UserDto dto = UserDto.from(user);
            if (user.getSerialCode() != null) {
                Optional<Personnel> personnel = personnelRepository.findBySerialCode(user.getSerialCode());
                personnel.ifPresent(p -> {
                    dto.setFirstName(p.getFirstName());
                    dto.setLastName(p.getLastName());
                    dto.setCin(p.getCin());
                });
            }
            return dto;
        }).collect(Collectors.toList());
    }







    private User findUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
    }

    @Override
    public List<RegionDto> getRegions() {
        List<Region> regions = regionRepository.findAll();
        log.info("Total regions found: {}", regions.size());
        return regions.stream()
                .map(r -> new RegionDto(r.getId(), r.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public List<DelegationDto> getDelegationsByRegion(Long regionId) {
        log.info("Fetching delegations for regionId: {}", regionId);
        List<Delegation> delegations = delegationRepository.findByRegion_Id(regionId);
        log.info("Found {} delegations", delegations.size());
        return delegations.stream()
                .map(d -> new DelegationDto(d.getId(), d.getName(), d.getRegion().getId()))
                .collect(Collectors.toList());
    }

    @Override
    public List<DelegationDto> getAllDelegations() {
        return delegationRepository.findAll().stream()
                .map(d -> new DelegationDto(d.getId(), d.getName(), d.getRegion() != null ? d.getRegion().getId() : null))
                .collect(Collectors.toList());
    }
}
