package com.nikitha.carbontrack.controller;

import com.nikitha.carbontrack.entity.Badge;
import com.nikitha.carbontrack.service.BadgeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/badges")
public class BadgeController {

    private final BadgeService badgeService;

    public BadgeController(BadgeService badgeService) {
        this.badgeService = badgeService;
    }

    @PostMapping
    public Badge addBadge(@RequestBody Badge badge) {
        return badgeService.saveBadge(badge);
    }

    @GetMapping
    public List<Badge> getAllBadges() {
        return badgeService.getAllBadges();
    }
}
