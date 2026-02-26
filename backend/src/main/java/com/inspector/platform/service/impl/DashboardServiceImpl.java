package com.inspector.platform.service.impl;

import com.inspector.platform.dto.UserDto;
import com.inspector.platform.dto.dashboard.AdminDashboardDto;
import com.inspector.platform.dto.dashboard.InspectorDashboardDto;
import com.inspector.platform.dto.dashboard.ResponsibleDashboardDto;
import com.inspector.platform.dto.dashboard.TeacherDashboardDto;
import com.inspector.platform.entity.Role;
import com.inspector.platform.entity.User;
import com.inspector.platform.exception.UserNotFoundException;
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

    @Override
    public AdminDashboardDto getAdminDashboard() {
        List<User> allUsers = userRepository.findAll();

        long totalUsers = allUsers.size();
        long pendingCount = allUsers.stream().filter(u -> !u.isEnabled()).count();
        long verifiedCount = allUsers.stream().filter(User::isEnabled).count();

        Map<String, Long> byRole = allUsers.stream()
                .collect(Collectors.groupingBy(
                        u -> u.getRole().name(),
                        Collectors.counting()));

        List<UserDto> latestPending = allUsers.stream()
                .filter(u -> !u.isEnabled())
                .sorted(Comparator.comparing(User::getCreatedAt).reversed())
                .limit(10)
                .map(UserDto::from)
                .collect(Collectors.toList());

        List<UserDto> recentlyVerified = allUsers.stream()
                .filter(u -> u.isEnabled() && u.getVerifiedAt() != null)
                .sorted(Comparator.comparing(User::getVerifiedAt).reversed())
                .limit(5)
                .map(UserDto::from)
                .collect(Collectors.toList());

        return AdminDashboardDto.builder()
                .totalUsers(totalUsers)
                .pendingVerifications(pendingCount)
                .verifiedUsers(verifiedCount)
                .usersByRole(byRole)
                .latestPendingAccounts(latestPending)
                .recentlyVerified(recentlyVerified)
                .build();
    }

    @Override
    public InspectorDashboardDto getInspectorDashboard(String email) {
        User user = findByEmailOrThrow(email);

        return InspectorDashboardDto.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .serialCode(user.getSerialCode())
                .role(user.getRole())
                .memberSince(user.getCreatedAt())
                .verifiedAt(user.getVerifiedAt())
                .status("ACTIVE")
                .message("Welcome back, Inspector! Your platform is ready.")
                .build();
    }

    @Override
    public TeacherDashboardDto getTeacherDashboard(String email) {
        User user = findByEmailOrThrow(email);

        return TeacherDashboardDto.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .serialCode(user.getSerialCode())
                .role(user.getRole())
                .memberSince(user.getCreatedAt())
                .verifiedAt(user.getVerifiedAt())
                .status("ACTIVE")
                .message("Welcome back, Teacher! Your dashboard is ready.")
                .build();
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
                .verifiedAt(user.getVerifiedAt())
                .totalTeachers(teachers.size())
                .totalInspectors(inspectors.size())
                .teachers(teachers)
                .inspectors(inspectors)
                .status("ACTIVE")
                .message("Welcome, Pedagogical Responsible! Here is your supervisory overview.")
                .build();
    }

    private User findByEmailOrThrow(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + email));
    }
}

