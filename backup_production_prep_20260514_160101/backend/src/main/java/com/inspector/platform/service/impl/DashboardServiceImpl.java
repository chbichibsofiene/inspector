package com.inspector.platform.service.impl;

import com.inspector.platform.dto.UserDto;
import com.inspector.platform.dto.dashboard.AdminDashboardDto;
import com.inspector.platform.dto.dashboard.InspectorDashboardDto;
import com.inspector.platform.dto.dashboard.ResponsibleDashboardDto;
import com.inspector.platform.dto.dashboard.TeacherDashboardDto;
import com.inspector.platform.entity.Role;
import com.inspector.platform.entity.User;
import com.inspector.platform.exception.UserNotFoundException;
import com.inspector.platform.repository.InspectorProfileRepository;
import com.inspector.platform.repository.TeacherProfileRepository;
import com.inspector.platform.repository.UserRepository;
import com.inspector.platform.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final TeacherProfileRepository teacherProfileRepository;
    private final InspectorProfileRepository inspectorProfileRepository;

    @Override
    public AdminDashboardDto getAdminDashboard() {
        List<User> allUsers = userRepository.findAll();

        long totalUsers = allUsers.size();

        Map<String, Long> byRole = allUsers.stream()
                .collect(Collectors.groupingBy(
                        u -> u.getRole().name(),
                        Collectors.counting()));

        return AdminDashboardDto.builder()
                .totalUsers(totalUsers)
                .usersByRole(byRole)
                .build();
    }

    @Override
    public InspectorDashboardDto getInspectorDashboard(String email) {
        User user = findByEmailOrThrow(email);

        InspectorDashboardDto.InspectorDashboardDtoBuilder builder = InspectorDashboardDto.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .serialCode(user.getSerialCode())
                .role(user.getRole())
                .memberSince(user.getCreatedAt())
                .profileCompleted(user.isProfileCompleted())
                .profileImageUrl(user.getProfileImageUrl())
                .status("ACTIVE")
                .message("Welcome back, Inspector! Your platform is ready.");

        if (user.isProfileCompleted()) {
            inspectorProfileRepository.findByUserId(user.getId()).ifPresent(profile -> {
                builder.phone(profile.getPhone())
                       .language(profile.getLanguage());
            });
        }

        return builder.build();
    }

    @Override
    public TeacherDashboardDto getTeacherDashboard(String email) {
        User user = findByEmailOrThrow(email);
        
        TeacherDashboardDto.TeacherDashboardDtoBuilder builder = TeacherDashboardDto.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .serialCode(user.getSerialCode())
                .role(user.getRole())
                .memberSince(user.getCreatedAt())
                .profileCompleted(user.isProfileCompleted())
                .profileImageUrl(user.getProfileImageUrl())
                .status("ACTIVE")
                .message("Welcome back, Teacher! Your dashboard is ready.");

        if (user.isProfileCompleted()) {
            teacherProfileRepository.findByUserId(user.getId()).ifPresent(profile -> {
                builder.firstName(profile.getFirstName())
                       .lastName(profile.getLastName())
                       .subject(profile.getSubject() != null ? profile.getSubject().name() : null)
                       .schoolName(profile.getEtablissement() != null ? profile.getEtablissement().getName() : null)
                       .phone(profile.getPhone())
                       .language(profile.getLanguage());
            });
        }

        return builder.build();
    }

    @Override
    public ResponsibleDashboardDto getResponsibleDashboard(String email) {
        User user = findByEmailOrThrow(email);

        List<UserDto> teachers = userRepository.findByRole(Role.TEACHER)
                .stream()
                .filter(User::isEnabled)
                .map(UserDto::from)
                .collect(Collectors.toList());

        List<UserDto> inspectors = userRepository.findByRole(Role.INSPECTOR)
                .stream()
                .filter(User::isEnabled)
                .map(UserDto::from)
                .collect(Collectors.toList());

        return ResponsibleDashboardDto.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .serialCode(user.getSerialCode())
                .role(user.getRole())
                .memberSince(user.getCreatedAt())
                .totalTeachers(teachers.size())
                .totalInspectors(inspectors.size())
                .teachers(teachers)
                .inspectors(inspectors)
                .profileImageUrl(user.getProfileImageUrl())
                .status("ACTIVE")
                .message("Welcome, Pedagogical Responsible! Here is your supervisory overview.")
                .build();
    }

    private User findByEmailOrThrow(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + email));
    }
}
