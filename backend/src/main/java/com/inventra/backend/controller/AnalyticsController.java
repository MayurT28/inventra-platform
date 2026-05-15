package com.inventra.backend.controller;

import com.inventra.backend
        .dto.AnalyticsResponse;

import com.inventra.backend
        .response.ApiResponse;

import com.inventra.backend
        .service.AnalyticsService;

import org.springframework
        .web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")

@CrossOrigin(
        origins =
                "http://localhost:5173"
)

public class AnalyticsController {

    private final AnalyticsService
            analyticsService;

    public AnalyticsController(
            AnalyticsService analyticsService
    ) {

        this.analyticsService =
                analyticsService;
    }

    @GetMapping
    public ApiResponse<
            AnalyticsResponse
            > getAnalytics() {

        return new ApiResponse<>(
                true,
                "Analytics fetched successfully",
                analyticsService
                        .getAnalytics()
        );
    }
}