package com.inspector.platform.controller;

import com.inspector.platform.dto.ApiResponse;
import com.inspector.platform.dto.UserDto;
import com.inspector.platform.entity.Role;
import com.inspector.platform.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.ok("All users retrieved", users));
    }

    
    @GetMapping("/users/pending")
    public ResponseEntity<ApiResponse<List<UserDto>>> getPendingUsers() {
        List<UserDto> pending = adminService.getPendingAccounts();
        return ResponseEntity.ok(ApiResponse.ok("Pending accounts retrieved", pending));
    }

    
    @PutMapping("/verify/{userId}")
    public ResponseEntity<ApiResponse<UserDto>> verifyUser(@PathVariable Long userId) {
        UserDto updated = adminService.verifyAccount(userId);
        return ResponseEntity.ok(ApiResponse.ok("Account verified successfully", updated));
    }

    
    @PutMapping("/role/{userId}")
    public ResponseEntity<ApiResponse<UserDto>> assignRole(
            @PathVariable Long userId,
            @RequestParam Role role) {

        UserDto updated = adminService.assignRole(userId, role);
        return ResponseEntity.ok(ApiResponse.ok("Role assigned: " + role, updated));
    }

    
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok(ApiResponse.ok("User deleted successfully"));
    }
}

