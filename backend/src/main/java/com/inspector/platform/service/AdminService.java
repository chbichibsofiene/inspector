package com.inspector.platform.service;

import com.inspector.platform.dto.UserDto;
import com.inspector.platform.entity.Role;

import java.util.List;

public interface AdminService {

    
    List<UserDto> getPendingAccounts();

    
    List<UserDto> getAllUsers();

    
    UserDto verifyAccount(Long userId);

    
    UserDto assignRole(Long userId, Role role);

    
    void deleteUser(Long userId);
}

