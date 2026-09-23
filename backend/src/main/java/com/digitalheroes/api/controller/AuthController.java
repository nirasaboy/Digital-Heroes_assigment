package com.digitalheroes.api.controller;

import com.digitalheroes.api.model.Profile;
import com.digitalheroes.api.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final ProfileRepository profileRepository;

    public record AuthRequest(String email, String password) {}
    public record AuthResponse(String id, String email, String role) {}

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        if (profileRepository.findByEmail(request.email()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Email already in use"));
        }

        Profile profile = new Profile();
        profile.setEmail(request.email());
        profile.setPassword(request.password()); // In a real app, hash this!
        profile.setRole("subscriber");
        profile.setSubscriptionStatus("inactive");
        profile.setCharityPercentage(new BigDecimal("10.00"));

        Profile savedProfile = profileRepository.save(profile);
        
        return ResponseEntity.ok(new AuthResponse(
            savedProfile.getId().toString(),
            savedProfile.getEmail(),
            savedProfile.getRole()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        Optional<Profile> profileOpt = profileRepository.findByEmail(request.email());
        
        if (profileOpt.isEmpty() || !profileOpt.get().getPassword().equals(request.password())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid email or password"));
        }

        Profile profile = profileOpt.get();
        return ResponseEntity.ok(new AuthResponse(
            profile.getId().toString(),
            profile.getEmail(),
            profile.getRole()
        ));
    }
}
