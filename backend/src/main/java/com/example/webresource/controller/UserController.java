package com.example.webresource.controller;

import com.example.webresource.dto.PasswordChangeDto;
import com.example.webresource.dto.UserUpdateDto;
import com.example.webresource.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(userService.getProfile(principal.getName()));
    }

    @PutMapping("/me/update")
    public ResponseEntity<?> updateProfile(@RequestBody UserUpdateDto req, Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        try {
            return ResponseEntity.ok(userService.updateProfile(principal.getName(), req));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/me/change-password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeDto req, Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        try {
            userService.changePassword(principal.getName(), req);
            return ResponseEntity.ok("Password changed successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

