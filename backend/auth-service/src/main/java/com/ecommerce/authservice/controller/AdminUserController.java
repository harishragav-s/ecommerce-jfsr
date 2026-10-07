package com.ecommerce.authservice.controller;

import com.ecommerce.authservice.dto.ApiResponse;
import com.ecommerce.authservice.dto.UserSummaryResponse;
import com.ecommerce.authservice.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ApiResponse<List<UserSummaryResponse>> getAllUsers() {
        return ApiResponse.ok(userService.getAllUsers());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String id) {
        if (!userService.deleteUser(id)) {
            return ResponseEntity.status(404).body(ApiResponse.fail("User not found or cannot be deleted"));
        }
        return ResponseEntity.ok(ApiResponse.okMessage("User deleted successfully"));
    }
}
