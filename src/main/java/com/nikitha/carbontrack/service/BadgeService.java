package com.nikitha.carbontrack.service;

import com.nikitha.carbontrack.entity.Badge;
import com.nikitha.carbontrack.repository.BadgeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BadgeService {

    private final BadgeRepository badgeRepository;

    public BadgeService(BadgeRepository badgeRepository) {
        this.badgeRepository = badgeRepository;
    }

    public Badge saveBadge(Badge badge) {
        return badgeRepository.save(badge);
    }

    public List<Badge> getAllBadges() {
        return badgeRepository.findAll();
    }
}
