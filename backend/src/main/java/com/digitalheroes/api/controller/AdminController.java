package com.digitalheroes.api.controller;

import com.digitalheroes.api.repository.DrawRepository;
import com.digitalheroes.api.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ProfileRepository profileRepository;
    private final DrawRepository drawRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        long totalUsers = profileRepository.count();
        long activeSubscribers = profileRepository.findAll().stream()
                .filter(p -> "active".equalsIgnoreCase(p.getSubscriptionStatus()))
                .count();
        
        // Simple mock calculations for now since we don't have a payments table
        BigDecimal totalPool = drawRepository.findAll().stream()
                .map(d -> d.getTotalPoolAmount() != null ? d.getTotalPoolAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Assume charity got roughly 10% of total revenue conceptually, 
        // but for stats let's just return some calculated metrics
        BigDecimal totalRaisedForCharity = totalPool.multiply(new BigDecimal("0.25")); // mock 25% of pool size

        return ResponseEntity.ok(Map.of(
                "totalUsers", totalUsers,
                "activeSubscribers", activeSubscribers,
                "totalPoolGenerated", totalPool,
                "totalRaisedForCharity", totalRaisedForCharity
        ));
    }
}
