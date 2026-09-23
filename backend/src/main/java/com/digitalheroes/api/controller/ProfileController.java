package com.digitalheroes.api.controller;

import com.digitalheroes.api.model.Charity;
import com.digitalheroes.api.model.Profile;
import com.digitalheroes.api.repository.CharityRepository;
import com.digitalheroes.api.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileRepository profileRepository;
    private final CharityRepository charityRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable UUID userId) {
        return profileRepository.findById(userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    public record CharityUpdateRequest(UUID charityId) {}

    @PutMapping("/{userId}/charity")
    public ResponseEntity<?> updateCharity(@PathVariable UUID userId, @RequestBody CharityUpdateRequest request) {
        Profile profile = profileRepository.findById(userId).orElse(null);
        if (profile == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }

        Charity charity = charityRepository.findById(request.charityId()).orElse(null);
        if (charity == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Charity not found"));
        }

        profile.setSelectedCharity(charity);
        return ResponseEntity.ok(profileRepository.save(profile));
    }

    public record PercentageUpdateRequest(BigDecimal percentage) {}

    @PutMapping("/{userId}/charity-percentage")
    public ResponseEntity<?> updateCharityPercentage(@PathVariable UUID userId, @RequestBody PercentageUpdateRequest request) {
        Profile profile = profileRepository.findById(userId).orElse(null);
        if (profile == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }

        BigDecimal p = request.percentage();
        if (p == null || p.compareTo(new BigDecimal("10.00")) < 0 || p.compareTo(new BigDecimal("30.00")) > 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Percentage must be between 10 and 30"));
        }

        profile.setCharityPercentage(p);
        return ResponseEntity.ok(profileRepository.save(profile));
    }

    public record RoleUpdateRequest(String role) {}

    @PutMapping("/{userId}/role")
    public ResponseEntity<?> updateRole(@PathVariable UUID userId, @RequestBody RoleUpdateRequest request) {
        Profile profile = profileRepository.findById(userId).orElse(null);
        if (profile == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }
        profile.setRole(request.role());
        return ResponseEntity.ok(profileRepository.save(profile));
    }
}
