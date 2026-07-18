package com.example.webresource.service;

import com.example.webresource.dto.*;
import com.example.webresource.model.User;
import com.example.webresource.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void registerUser(RegisterRequest req) {
        // Validate at least one contact channel exists
        if ((req.email == null || req.email.isBlank()) && (req.phoneNumber == null || req.phoneNumber.isBlank())) {
            throw new IllegalArgumentException("At least one of email or phone number is mandatory");
        }

        // Standard Email Validation Regex
        if (req.email != null && !req.email.isBlank()) {
            if (!req.email.matches("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$")) {
                throw new IllegalArgumentException("Invalid email format");
            }
            if (userRepository.existsByEmail(req.email)) {
                throw new IllegalArgumentException("Email already exists");
            }
        }

        // Phone Validation (numeric structures between 10 and 15 digits)
        if (req.phoneNumber != null && !req.phoneNumber.isBlank()) {
            if (!req.phoneNumber.matches("^\\+?[0-9]{10,15}$")) {
                throw new IllegalArgumentException("Invalid phone number format");
            }
            if (userRepository.existsByPhoneNumber(req.phoneNumber)) {
                throw new IllegalArgumentException("Phone number already exists");
            }
        }

        // Password complexity requirement checking
        if (req.password == null || req.password.length() < 6 ||
                !req.password.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{6,}$")) {
            throw new IllegalArgumentException("Password must be at least 6 characters, containing lowercase, uppercase, and a digit.");
        }

        if (userRepository.existsByUsername(req.username)) {
            throw new IllegalArgumentException("Username already exists");
        }

        User user = new User(
                req.username,
                passwordEncoder.encode(req.password), // Salted Cryptographic hash
                req.name,
                req.email,
                req.phoneNumber
        );
        userRepository.save(user);
    }

    public UserResponse getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toUserResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(String username, UserUpdateDto req) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if ((req.email == null || req.email.isBlank()) && (req.phoneNumber == null || req.phoneNumber.isBlank())) {
            throw new IllegalArgumentException("At least one of email or phone number is mandatory");
        }

        if (req.email != null && !req.email.isBlank()) {
            if (!req.email.matches("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$")) {
                throw new IllegalArgumentException("Invalid email format");
            }
            if (!req.email.equals(user.getEmail()) && userRepository.existsByEmail(req.email)) {
                throw new IllegalArgumentException("Email already exists");
            }
            user.setEmail(req.email);
        } else {
            user.setEmail(null);
        }

        if (req.phoneNumber != null && !req.phoneNumber.isBlank()) {
            if (!req.phoneNumber.matches("^\\+?[0-9]{10,15}$")) {
                throw new IllegalArgumentException("Invalid phone number format");
            }
            if (!req.phoneNumber.equals(user.getPhoneNumber()) && userRepository.existsByPhoneNumber(req.phoneNumber)) {
                throw new IllegalArgumentException("Phone number already exists");
            }
            user.setPhoneNumber(req.phoneNumber);
        } else {
            user.setPhoneNumber(null);
        }

        userRepository.save(user);
        return toUserResponse(user);
    }

    @Transactional
    public void changePassword(String username, PasswordChangeDto req) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(req.oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("Incorrect current password");
        }

        if (req.newPassword == null || req.newPassword.length() < 6 ||
                !req.newPassword.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{6,}$")) {
            throw new IllegalArgumentException("Password must be at least 6 characters, containing lowercase, uppercase, and a digit.");
        }

        user.setPassword(passwordEncoder.encode(req.newPassword));
        userRepository.save(user);
    }

    private UserResponse toUserResponse(User user) {
        UserResponse res = new UserResponse();
        res.username = user.getUsername();
        res.name = user.getName();
        res.email = user.getEmail();
        res.phoneNumber = user.getPhoneNumber();
        res.articles = user.getArticles().stream()
                .map(a -> new ArticleResponse(
                        a.getId(), a.getTitle(), a.getSummary(), a.getBody(),
                        a.getPublishTime(), a.getRefs().stream().map(ref -> ref.getTitle()).toList(),
                        a.getReferrers().size(), user.getUsername()
                )).collect(Collectors.toList());
        return res;
    }
}
