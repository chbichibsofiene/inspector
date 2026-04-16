package com.inspector.platform.service.impl;

import com.inspector.platform.dto.UserDto;
import com.inspector.platform.entity.Role;
import com.inspector.platform.entity.User;
import com.inspector.platform.exception.UserNotFoundException;
import com.inspector.platform.repository.UserRepository;
import com.inspector.platform.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;

    @Override
    public List<UserDto> getPendingAccounts() {
        return userRepository.findByEnabledFalse()
                .stream()
                .map(UserDto::from)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserDto::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserDto verifyAccount(Long userId) {
        User user = findUserOrThrow(userId);
        user.setEnabled(true);
        user.setVerifiedAt(LocalDateTime.now());
        User saved = userRepository.save(user);
        log.info("Admin verified account for user: {} [{}]", saved.getEmail(), saved.getRole());
        return UserDto.from(saved);
    }

    @Override
    @Transactional
    public UserDto assignRole(Long userId, Role role) {
        User user = findUserOrThrow(userId);
        user.setRole(role);
        User saved = userRepository.save(user);
        log.info("Admin assigned role {} to user: {}", role, saved.getEmail());
        return UserDto.from(saved);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        User user = findUserOrThrow(userId);
        userRepository.delete(user);
        log.info("Admin deleted user: {}", user.getEmail());
    }

    private User findUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
    }
}

