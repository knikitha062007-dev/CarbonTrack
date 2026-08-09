package com.carbontracker.CarbonTracker.controller;

import com.carbontracker.CarbonTracker.dto.CertificateResponse;
import com.carbontracker.CarbonTracker.entity.User;
import com.carbontracker.CarbonTracker.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/certificate")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;

    @GetMapping
    public CertificateResponse getCertificate(
            @AuthenticationPrincipal User user
    ) {
        return certificateService.getCertificate(user);
    }
}