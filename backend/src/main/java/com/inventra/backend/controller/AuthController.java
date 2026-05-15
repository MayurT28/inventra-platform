package com.inventra.backend.controller;

import com.inventra.backend.dto.LoginRequest;
import com.inventra.backend.dto.RegisterRequest;
import com.inventra.backend.entity.User;
import com.inventra.backend.response.ApiResponse;
import com.inventra.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import com.inventra.backend.dto.AuthResponse;
import com.inventra.backend.service.JwtService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

        private final AuthService authService;
        private final JwtService jwtService;

        public AuthController(
                        AuthService authService,
                        JwtService jwtService) {
                this.authService = authService;
                this.jwtService = jwtService;
        }

        // REGISTER
        @PostMapping("/register")
        public ApiResponse<User> register(
                        @Valid @RequestBody RegisterRequest request) {

                User user = authService.register(request);

                return new ApiResponse<>(
                                true,
                                "User registered successfully",
                                user);
        }

        // LOGIN
        @PostMapping("/login")
        public ApiResponse<AuthResponse> login(
                        @Valid @RequestBody LoginRequest request) {

                User user = authService.login(request);

                String token = jwtService.generateToken(
                                user.getEmail());

                AuthResponse response = new AuthResponse(
                                token,
                                user.getRole(),
                                user.getUsername());

                return new ApiResponse<>(
                                true,
                                "Login successful",
                                response);
        }
}