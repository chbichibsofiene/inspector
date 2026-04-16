package com.inspector.platform.service;

import com.inspector.platform.dto.UserDto;

import java.util.List;

public interface UserService {

    UserDto getUserById(Long id);

    UserDto getUserByEmail(String email);

    List<UserDto> getAllUsers();

    void deleteUser(Long id);
}

