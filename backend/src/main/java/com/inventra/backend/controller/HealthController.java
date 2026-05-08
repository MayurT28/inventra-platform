package com.inventra.backend.controller;

import com.inventra.backend.dto.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class HealthController {

    @GetMapping("/api/health")
    public ApiResponse healthCheck() {

        return new ApiResponse(
                "success",
                "Inventra Backend Running Successfully!");
    }
}