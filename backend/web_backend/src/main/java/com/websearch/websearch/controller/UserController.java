package com.websearch.websearch.controller;

import com.websearch.websearch.dto.LoginRequestDTO;
import com.websearch.websearch.dto.PasswordUpdateDTO;
import com.websearch.websearch.dto.UpdateUserDTO;
import com.websearch.websearch.dto.UserRequestDTO;
import com.websearch.websearch.entity.User;
import com.websearch.websearch.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Management", description = "APIs for managing user accounts")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Create a new user account and return user details")
    @ApiResponse(responseCode = "200", description = "User registered successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input data")
    public ResponseEntity<?> register(@RequestBody UserRequestDTO userRequestDTO) {
        try {
            User user = userService.register(userRequestDTO);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    @Operation(summary = "Login user", description = "Authenticate user and return JWT token with user details")
    @ApiResponse(responseCode = "200", description = "Login successful")
    @ApiResponse(responseCode = "400", description = "Invalid credentials")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequestDTO) {
        try {
            UserService.UserLoginResponse response = userService.login(loginRequestDTO.getEmail(), loginRequestDTO.getPassword());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/updatePassword")
    @Operation(summary = "Update user password", description = "Change the user's password")
    @ApiResponse(responseCode = "200", description = "Password updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input, token, old password, or new password format")
    public ResponseEntity<?> updatePassword(@RequestHeader("Authorization") String token,
                                            @RequestBody PasswordUpdateDTO passwordUpdateDTO) {
        try {
            Long userId = userService.getUserIdFromToken(token);
            if (userId == null) {
                return ResponseEntity.badRequest().body("Invalid token");
            }
            User user = userService.updatePassword(userId, passwordUpdateDTO);
            return ResponseEntity.ok("Password updated successfully");
        } catch (IllegalArgumentException e) {
            String errorMessage = e.getMessage();
            if ("User not found".equals(errorMessage)) {
                return ResponseEntity.badRequest().body("User not found");
            } else if ("Old password is incorrect".equals(errorMessage)) {
                return ResponseEntity.badRequest().body("Old password is incorrect");
            } else if ("New password must be at least 8 characters long and contain uppercase, lowercase, and numbers".equals(errorMessage)) {
                return ResponseEntity.badRequest().body("New password must be at least 8 characters long and contain uppercase, lowercase, and numbers");
            }
            return ResponseEntity.badRequest().body(errorMessage);
        }
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user", description = "Invalidate user session")
    @ApiResponse(responseCode = "200", description = "Logout successful")
    @ApiResponse(responseCode = "400", description = "Invalid token")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String token) {
        try {
            userService.logout(token);
            return ResponseEntity.ok().body("Logout successful");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Logout failed: " + e.getMessage());
        }
    }

    @GetMapping("/useOnlineStatus")
    @Operation(summary = "Check user status", description = "Get the online status of a user")
    @ApiResponse(responseCode = "200", description = "Status retrieved successfully")
    @ApiResponse(responseCode = "400", description = "Invalid token or user not found")
    public ResponseEntity<?> getUserStatus(@RequestHeader("Authorization") String token) {
        try {
            Long userId = userService.getUserIdFromToken(token);
            if (userId == null) {
                throw new IllegalArgumentException("Invalid token");
            }
            Boolean isOnline = userService.getUserStatus(userId);
            return ResponseEntity.ok(isOnline);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/updateAvatar")
    @Operation(summary = "Update user avatar", description = "Update the user's avatar via Base64 or file upload")
    @ApiResponse(responseCode = "200", description = "Avatar updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid token, user not found, or file/image error")
    public ResponseEntity<?> updateAvatar(@RequestHeader("Authorization") String token,
                                          @RequestParam(value = "base64Avatar", required = false) String base64Avatar,
                                          @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            Long userId = userService.getUserIdFromToken(token);
            if (userId == null) {
                throw new IllegalArgumentException("Invalid token");
            }
            User user = userService.updateAvatar(userId, base64Avatar, file);
            return ResponseEntity.ok("Avatar updated successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Failed to process uploaded file or image");
        }
    }

    @PutMapping("/updateUserInformation")
    @Operation(summary = "Update user information", description = "Update user's username, avatar, or signature partially")
    @ApiResponse(responseCode = "200", description = "User information updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid token, user not found, or invalid data")
    public ResponseEntity<?> updateUserInformation(@RequestHeader("Authorization") String token,
                                                   @RequestBody UpdateUserDTO updateUserDTO,
                                                   @RequestParam(value = "base64Avatar", required = false) String base64Avatar,
                                                   @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            Long userId = userService.getUserIdFromToken(token);
            if (userId == null) {
                throw new IllegalArgumentException("Invalid token");
            }
            User user = userService.updateUserInformation(userId, updateUserDTO, base64Avatar, file);
            return ResponseEntity.ok("User information updated successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Failed to process uploaded file or image");
        }
    }

    @PutMapping("/updateSignature")
    @Operation(summary = "Update user signature", description = "Update the user's signature")
    @ApiResponse(responseCode = "200", description = "Signature updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid token or user not found")
    public ResponseEntity<?> updateSignature(@RequestHeader("Authorization") String token, @RequestParam String signature) {
        try {
            Long userId = userService.getUserIdFromToken(token);
            if (userId == null) {
                throw new IllegalArgumentException("Invalid token");
            }
            User user = userService.updateSignature(userId, signature);
            return ResponseEntity.ok("Signature updated successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/updateUsername")
    @Operation(summary = "Update user username", description = "Change the user's username")
    @ApiResponse(responseCode = "200", description = "Username updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid token or user not found")
    public ResponseEntity<?> updateUsername(@RequestHeader("Authorization") String token, @RequestParam String newUsername) {
        try {
            Long userId = userService.getUserIdFromToken(token);
            if (userId == null) {
                throw new IllegalArgumentException("Invalid token");
            }
            User user = userService.updateUsername(userId, newUsername);
            return ResponseEntity.ok("Username updated successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}